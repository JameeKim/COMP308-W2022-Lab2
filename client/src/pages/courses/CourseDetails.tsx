import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import { courseSectionToNumber, isCourseSectionLike, sectionToString } from "@dohyunkim/common";
import SimpleButtonForm from "src/components/form/SimpleButtonForm";
import PageLoading from "src/components/PageLoading";
import { useAuth } from "src/contexts/auth";
import { gql } from "src/graphql";

import { useCourseContext } from "./SingleCourse";

const STUDENTS_IN_COURSE = gql(/* GraphQL */`
  query StudentsInCourse {
    students {
      ...StudentOther
    }
  }
`);

export default function CourseDetails(): JSX.Element {
  const course = useCourseContext();
  const students = useQuery(STUDENTS_IN_COURSE);
  const { user, doWhoami } = useAuth();

  const onChange = useCallback((res: Response): void => {
    if (res.status === 200) {
      students.refetch();
      doWhoami();
    }
  }, [doWhoami, students]);

  const userIsInCourse = user && user.courses.some(({ _id }) => _id === course.data?._id);

  return (
    <main>
      <Link to="/courses/all">&lt; All courses</Link>

      <section>
        <h1 className="mb-3">Course Details</h1>
        <div className="mb-3 d-flex">
          <button type="button" className="btn btn-outline-secondary" onClick={course.refetch}>
            Fetch Again
          </button>
          {user && course.data && (
            <SimpleButtonForm
              method={userIsInCourse ? "DELETE" : "PUT"}
              action={`/api/students/${user._id}/courses/${course.data._id}`}
              formClass="d-flex ms-auto"
              btnClass={`btn btn-sm btn-outline-${userIsInCourse ? "danger" : "success"} w-100`}
              onResponse={onChange}
              disabled={course.loading}
            >
              {userIsInCourse ? "Drop" : "Add"}
            </SimpleButtonForm>
          )}
          {user && course.data && (
            <Link
              to={`/courses/${course.data._id}/edit`}
              className={
                classNames("btn btn-outline-primary", { disabled: course.loading }, "ms-3")
              }
              aria-disabled={course.loading}
            >
              Edit
            </Link>
          )}
        </div>
        <PageLoading show={course.loading || students.loading} />
        {course.error && (
          <p className="alert alert-danger" role="alert">{course.error}</p>
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
              <th scope="row">Semester</th>
              <td>{course.data?.semester ?? "X0000"}</td>
            </tr>
            <tr>
              <th scope="col">Code</th>
              <td>{course.data?.code ?? "XXXX000"}</td>
            </tr>
            <tr>
              <th scope="col">Section</th>
              <td>
                {isCourseSectionLike(course.data?.section)
                  ? sectionToString(courseSectionToNumber(course.data?.section, true))
                  : "000"}
              </td>
            </tr>
            <tr>
              <th scope="col">Name</th>
              <td>{course.data?.name ?? "-"}</td>
            </tr>
          </tbody>
          <tfoot></tfoot>
        </table>
      </section>

      {user && (
        <section className="mt-5">
          <h2 className="mb-3">Registered Students</h2>
          <table className="table table-bordered table-responsive align-middle">
            <thead>
              <tr>
                <th scope="col">Student ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col"><span className="visually-hidden">View Details</span></th>
              </tr>
            </thead>
            <tbody>
              {students.error && (
                <p className="alert alert-danger" role="alert">{students.error.message}</p>
              )}
              {students.data && students.data.students.map((student) => (
                <tr key={student._id}>
                  <td>{student.idNumber}</td>
                  <td>{student.lastName}, {student.firstName}</td>
                  <td>{student.email}</td>
                  <td>
                    <Link
                      to={`/students/${student._id}`}
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
