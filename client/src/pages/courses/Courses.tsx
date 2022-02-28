import { useCallback } from "react";
import { Link } from "react-router-dom";

import { CourseData, sectionToString } from "@dohyunkim/common";
import SimpleButtonForm from "src/components/form/SimpleButtonForm";
import { useAuth } from "src/contexts/auth";
import useFetchData, { FetchStatus } from "src/hooks/useFetchData";

export default function Courses(): JSX.Element {
  const { user, markHealthCheck } = useAuth();
  const url = `/api/students/${user?._id}/courses`;
  const { status, responseStatus, data, refetch } = useFetchData<CourseData[]>(url, !user);

  const onChange = useCallback((res: Response): void => {
    if (res.status === 200) {
      refetch();
      markHealthCheck();
    }
  }, [markHealthCheck, refetch]);

  return (
    <main>
      <h1 className="mb-3">My Courses</h1>
      <div className="d-flex mb-3 align-items-end">
        <button type="button" className="btn btn-outline-secondary" onClick={refetch}>
          Fetch Again
        </button>
        <Link to="/courses/all" className="ms-auto me-2">See All Courses &gt;</Link>
      </div>
      {!user && (
        <p className="alert alert-primary">
          You need to <Link to="/auth/sign-in">sign in</Link> to register to courses and view the
          list.
        </p>
      )}
      {status === FetchStatus.Pending && <p>Loading...</p>}
      {status === FetchStatus.Error && responseStatus >= 500 && <p>Error</p>}
      {status !== FetchStatus.Pending && <p>{user ? data?.length : 0} courses</p>}
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col">Semester</th>
            <th scope="col">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Section</th>
            {user && (
              <>
                <th scope="col"><span className="visually-hidden">Drop</span></th>
                <th scope="col"><span className="visually-hidden">Edit</span></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {user && data?.map((course) => (
            <tr key={`${course._id}`}>
              <td>{course.semester}</td>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{sectionToString(course.section)}</td>
              {user && (
                <>
                  <td>
                    <SimpleButtonForm
                      method="DELETE"
                      action={`/api/students/${user._id}/courses/${course._id}`}
                      btnClass="btn btn-sm btn-outline-danger w-100"
                      onResponse={onChange}
                    >
                      Drop
                    </SimpleButtonForm>
                  </td>
                  <td>
                    <Link
                      to={`/courses/edit/${course._id}`}
                      className="btn btn-sm btn-outline-primary w-100"
                    >
                      Edit
                    </Link>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
