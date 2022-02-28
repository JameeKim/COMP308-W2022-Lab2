import { useCallback } from "react";
import { Link } from "react-router-dom";

import { CourseData, sectionToString } from "@dohyunkim/common";
import SimpleButtonForm from "src/components/form/SimpleButtonForm";
import { useAuth } from "src/contexts/auth";
import useFetchData, { FetchStatus } from "src/hooks/useFetchData";

export default function CourseAll(): JSX.Element {
  const { status, data, refetch } = useFetchData<CourseData[]>("/api/courses");
  const { user, markHealthCheck } = useAuth();

  const onChange = useCallback((res: Response): void => {
    if (res.status === 200) {
      refetch();
      markHealthCheck();
    }
  }, [markHealthCheck, refetch]);

  return (
    <main>
      <Link to="../" className="ms-2">&lt; To my courses</Link>
      <h1 className="mb-3">All Courses</h1>
      <div className="d-flex mb-3">
        <button type="button" className="btn btn-outline-secondary" onClick={refetch}>
          Fetch Again
        </button>
        {user && <Link to="/courses/add" className="btn btn-primary ms-auto">Add a Course</Link>}
      </div>
      {status === FetchStatus.Pending && <p>Loading...</p>}
      {status === FetchStatus.Error && <p>Error</p>}
      {status !== FetchStatus.Pending && <p>{data?.length} courses</p>}
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col">Semester</th>
            <th scope="col">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Section</th>
            {user && (
              <>
                <th scope="col"><span className="visually-hidden">Drop/Add</span></th>
                <th scope="col"><span className="visually-hidden">Edit</span></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data?.map((course) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const userIsIn = (user?.courses?.indexOf(course._id!) ?? -1) >= 0;
            const btnStyle = userIsIn ? "danger" : "success";
            return (
              <tr key={`${course._id}`}>
                <td>{course.semester}</td>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{sectionToString(course.section)}</td>
                {user && user.courses && (
                  <td>
                    <SimpleButtonForm
                      method={userIsIn ? "DELETE" : "PUT"}
                      action={`/api/students/${user._id}/courses/${course._id}`}
                      btnClass={`btn btn-sm btn-outline-${btnStyle} w-100`}
                      onResponse={onChange}
                    >
                      {userIsIn ? "Drop" : "Add"}
                    </SimpleButtonForm>
                  </td>
                )}
                {user && (
                  <td>
                    <Link
                      to={`/courses/edit/${course._id}`}
                      className="btn btn-sm btn-outline-primary w-100"
                    >
                      Edit
                    </Link>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
