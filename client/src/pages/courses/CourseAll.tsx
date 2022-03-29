import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import { sectionToString } from "@dohyunkim/common";
import SimpleButtonForm from "src/components/form/SimpleButtonForm";
import PageLoading from "src/components/PageLoading";
import { useAuth } from "src/contexts/auth";
import { gql } from "src/graphql";

const COURSE_ALL = gql(/* GraphQL */`
  query CourseAll {
    courses {
      ...Course
    }
  }
`);

export default function CourseAll(): JSX.Element {
  const { loading, error, data, refetch } = useQuery(COURSE_ALL);
  const { user, doWhoami } = useAuth();

  const onRefetchClick = useCallback(
    (): void => { refetch(); },
    [refetch],
  );

  const onChange = useCallback((res: Response): void => {
    if (res.status === 200) doWhoami();
  }, [doWhoami]);

  return (
    <main>
      <Link to="../" className="ms-2">&lt; To my courses</Link>
      <h1 className="mb-3">All Courses</h1>
      <div className="d-flex mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={loading}
          onClick={onRefetchClick}
        >
          Fetch Again
        </button>
        {user && <Link to="/courses/add" className="btn btn-primary ms-auto">Add a Course</Link>}
      </div>
      {<PageLoading show={loading} />}
      {error && <p className="alert alert-danger" role="alert">Error: <code>{error}</code></p>}
      <p>{data?.courses.length ?? 0} courses</p>
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
          {data?.courses.map((course) => {
            const userIsIn = user?.courses.some(({ _id }) => _id === course._id);
            const btnStyle = userIsIn ? "danger" : "success";
            return (
              <tr key={`${course._id}`}>
                <td>{course.semester}</td>
                <td>{course.code}</td>
                <td><Link to={`../${course._id}`}>{course.name}</Link></td>
                <td>{sectionToString(course.section)}</td>
                {user && (
                  <>
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
                    <td>
                      <Link
                        to={`../${course._id}/edit`}
                        className="btn btn-sm btn-outline-primary w-100"
                      >
                      Edit
                      </Link>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
