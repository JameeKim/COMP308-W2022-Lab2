import classNames from "classnames";
import { Link, useParams } from "react-router-dom";

import {
  CourseDataFromServer,
  StudentDataSmallFromServer,
  sectionToString,
} from "@dohyunkim/common";
import PageLoading from "src/components/PageLoading";
import { useAuth } from "src/contexts/auth";
import useFetchData from "src/hooks/useFetchData";

export default function StudentDetails(): JSX.Element {
  const { id } = useParams();
  const url = `/api/students/${id}`;
  const { pending, error, data, refetch } = useFetchData<StudentDataSmallFromServer>(url);
  const courses = useFetchData<CourseDataFromServer[]>(`${url}/courses`);
  const { user } = useAuth();

  return (
    <main>
      <Link to="/students">&lt; All students</Link>

      <section>
        <h1 className="mb-3">Student Details</h1>
        <div className="mb-3 d-flex">
          <button type="button" className="btn btn-outline-secondary" onClick={refetch}>
            Fetch Again
          </button>
          {user?._id === data?._id && (
            <Link to="/auth/account" className="btn btn-outline-primary ms-auto">
              Edit Info
            </Link>
          )}
        </div>
        <PageLoading show={pending} />
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
              <th scope="row" className={classNames(data && "text-muted")}>Student ID</th>
              <td>{data?.idNumber ?? "000000000"}</td>
            </tr>
            <tr>
              <th scope="row" className={classNames(data && "text-muted")}>Name</th>
              <td>{data ? `${data.lastName}, ${data.firstName}` : "Last, First"}</td>
            </tr>
            <tr>
              <th scope="row" className={classNames(data && "text-muted")}>Email</th>
              <td>{data?.email ?? "xxxx@my.centennialcollege.ca"}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {courses.data && (
        <section className="mt-5">
          <h2 className="mb-3">Enrolled Courses</h2>
          <div className="mb-3 d-flex">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={courses.pending}
              onClick={courses.refetch}
            >
              Fetch Again
            </button>
            {user?._id === data?._id && (
              <Link to="/courses" className="btn btn-outline-primary ms-auto">
                Manage Courses
              </Link>
            )}
          </div>
          {courses.error && (
            <p className="alert alert-danger" role="alert">
              Error occurred while getting data: <code>{courses.error}</code>
            </p>
          )}
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
              {courses.pending && (
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
              {!courses.pending && courses.data.map((course) => (
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
