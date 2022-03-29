import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import { sectionToString } from "@dohyunkim/common";
import PageLoading from "src/components/PageLoading";
import { useAuth } from "src/contexts/auth";
import { gql } from "src/graphql";

const STUDENT_BY_ID = gql(/* GraphQL */`
  query StudentById($id: ID!) {
    student(id: $id) {
      ...StudentOther
      courses {
        ...Course
      }
    }
  }
`);

export default function StudentDetails(): JSX.Element {
  const { id = "" } = useParams();
  const { loading, error, data, refetch } = useQuery(STUDENT_BY_ID, { variables: { id } });
  const { user } = useAuth();

  const onRefetchClick = useCallback(
    (): void => { refetch(); },
    [refetch],
  );

  const student = data?.student;
  const courses = student?.courses;

  return (
    <main>
      <Link to="/students">&lt; All students</Link>

      <section>
        <h1 className="mb-3">Student Details</h1>
        <div className="mb-3 d-flex">
          <button type="button" className="btn btn-outline-secondary" onClick={onRefetchClick}>
            Fetch Again
          </button>
          {user?._id === student?._id && (
            <Link to="/auth/account" className="btn btn-outline-primary ms-auto">
              Edit Info
            </Link>
          )}
        </div>
        <PageLoading show={loading} />
        {error && (
          <p className="alert alert-danger" role="alert">
            Error occurred while getting data: <code>{error}</code>
          </p>
        )}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={classNames(student && "text-muted")}>Student ID</th>
              <td>{student?.idNumber ?? "000000000"}</td>
            </tr>
            <tr>
              <th scope="row" className={classNames(student && "text-muted")}>Name</th>
              <td>{student ? `${student.lastName}, ${student.firstName}` : "Last, First"}</td>
            </tr>
            <tr>
              <th scope="row" className={classNames(student && "text-muted")}>Email</th>
              <td>{student?.email ?? "xxxx@my.centennialcollege.ca"}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {courses && (
        <section className="mt-5">
          <h2 className="mb-3">Enrolled Courses</h2>
          <div className="mb-3 d-flex">
            {user?._id === student?._id && (
              <Link to="/courses" className="btn btn-outline-primary ms-auto">
                Manage Courses
              </Link>
            )}
          </div>
          <table className="table table-bordered table-responsive table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Semester</th>
                <th scope="col">Code</th>
                <th scope="col">Section</th>
                <th scope="col">Name</th>
                <th scope="col" style={{ width: "2.5rem" }}>
                  <span className="visually-hidden">View Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td rowSpan={3} colSpan={4}>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading data...</span>
                      </div>
                    </div>
                  </td>
                  <td rowSpan={3}>
                    <Link
                      to=""
                      className="btn btn-sm btn-outline-secondary w-100 disabled"
                      aria-disabled
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )}
              {!loading && courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.semester}</td>
                  <td>{course.code}</td>
                  <td>{sectionToString(course.section)}</td>
                  <td>{course.name}</td>
                  <td>
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-sm btn-outline-secondary w-100"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
