import classNames from "classnames";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import {
  StudentDataSmallFromServer, courseSectionToNumber, isCourseSectionLike, sectionToString,
} from "@dohyunkim/common";
import SimpleButtonForm from "src/components/form/SimpleButtonForm";
import PageLoading from "src/components/PageLoading";
import { useAuth } from "src/contexts/auth";
import useFetchData, { FetchStatus } from "src/hooks/useFetchData";

import { useCourseContext } from "./SingleCourse";

interface StudentRowProps {
  studentId: string;
}

function StudentRow({ studentId }: StudentRowProps): JSX.Element {
  const { status, pending, error, data } =
    useFetchData<StudentDataSmallFromServer>(`/api/students/${studentId}`);
  return (
    <tr>
      <td className={classNames({
        "text-danger": !!error,
        "text-success": status === FetchStatus.Success,
      })}>
        <span
          className={classNames("text-center", { invisible: pending })}
          role="status"
          aria-label={!pending ? status.toString() : undefined}
          aria-hidden={pending}
        >
          {error ? "X" : "O"}
        </span>
      </td>
      {pending ? (
        <td colSpan={3} className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading data...</span>
          </div>
        </td>
      ) : (error || !data) ? (
        <td colSpan={3} className="text-center text-danger">
          Failed to get student data: <code>{error || "No data"}</code>
        </td>
      ) : (
        <>
          <td>{data.idNumber}</td>
          <td>{data.lastName}, {data.firstName}</td>
          <td>{data.email}</td>
        </>
      )}
      <td>
        <Link to={`/students/${studentId}`} className="btn btn-sm btn-outline-secondary w-100">
          View
        </Link>
      </td>
    </tr>
  );
}

export default function CourseDetails(): JSX.Element {
  const { pending, error, data, refetch } = useCourseContext();
  const { user, doWhoami } = useAuth();

  const notFound = error === "not_found";

  const onChange = useCallback((res: Response): void => {
    if (res.status === 200) {
      refetch();
      doWhoami();
    }
  }, [doWhoami, refetch]);

  const userIsInCourse = user && data && (user.courses.includes(data._id));

  return (
    <main>
      <Link to="/courses/all">&lt; All courses</Link>

      <section>
        <h1 className="mb-3">Course Details</h1>
        <div className="mb-3 d-flex">
          <button type="button" className="btn btn-outline-secondary" onClick={refetch}>
          Fetch Again
          </button>
          {user && data && (
            <SimpleButtonForm
              method={userIsInCourse ? "DELETE" : "PUT"}
              action={`/api/students/${user._id}/courses/${data._id}`}
              formClass="d-flex ms-auto"
              btnClass={`btn btn-sm btn-outline-${userIsInCourse ? "danger" : "success"} w-100`}
              onResponse={onChange}
              disabled={pending}
            >
              {userIsInCourse ? "Drop" : "Add"}
            </SimpleButtonForm>
          )}
          {user && data && (
            <Link
              to={`/courses/${data._id}/edit`}
              className={classNames("btn btn-outline-primary", { disabled: pending }, "ms-3")}
              aria-disabled={pending}
            >
              Edit
            </Link>
          )}
        </div>
        <PageLoading show={pending} />
        {error && (
          <p className="alert alert-danger" role="alert">
            {notFound ? "No such course" : "Error occurred while fetching data from server"}
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
              <th scope="row">Semester</th>
              <td>{data?.semester ?? "X0000"}</td>
            </tr>
            <tr>
              <th scope="col">Code</th>
              <td>{data?.code ?? "XXXX000"}</td>
            </tr>
            <tr>
              <th scope="col">Section</th>
              <td>
                {isCourseSectionLike(data?.section)
                  ? sectionToString(courseSectionToNumber(data?.section, true))
                  : "000"}
              </td>
            </tr>
            <tr>
              <th scope="col">Name</th>
              <td>{data?.name ?? "-"}</td>
            </tr>
          </tbody>
          <tfoot></tfoot>
        </table>
      </section>

      {(user && data?.students) && (
        <section className="mt-5">
          <h2 className="mb-3">Registered Students</h2>
          <table className="table table-bordered table-responsive align-middle">
            <thead>
              <tr>
                <th scope="col"><span className="visually-hidden">Status</span></th>
                <th scope="col">Student ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col"><span className="visually-hidden">View Details</span></th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((id) => <StudentRow key={id} studentId={id} />)}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
