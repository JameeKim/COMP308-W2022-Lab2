import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import { sectionToString } from "@dohyunkim/common";
import SimpleButtonForm from "src/components/form/SimpleButtonForm";
import PageLoading from "src/components/PageLoading";
import { gql } from "src/graphql";

const MY_COURSES = gql(/* GraphQL */`
  query MyCourses {
    whoami {
      _id
      courses {
        ...Course
      }
    }
  }
`);

export default function Courses(): JSX.Element {
  const { loading, error, data, refetch } = useQuery(MY_COURSES);
  const user = data?.whoami;

  const onChange = useCallback((res: Response): void => {
    if (res.status === 200) {
      refetch();
    }
  }, [refetch]);

  return (
    <main>
      <h1 className="mb-3">My Courses</h1>
      <div className="d-flex mb-3 align-items-end">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={loading || !user}
          onClick={(): void => { refetch(); }}
        >
          Fetch Again
        </button>
        <Link to="/courses/all" className="ms-auto me-2">See All Courses &gt;</Link>
      </div>
      {(!loading && !user) && (
        <p className="alert alert-primary">
          You need to <Link to="/auth/sign-in">sign in</Link> to register to courses and view the
          list.
        </p>
      )}
      <PageLoading show={loading} />
      {error && <p className="alert alert-danger" role="alert">{error.message}</p>}
      {!loading && <p>{user?.courses.length ?? 0} courses</p>}
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
          {user && user.courses.map((course) => (
            <tr key={course._id}>
              <td>{course.semester}</td>
              <td>{course.code}</td>
              <td><Link to={`./${course._id}`}>{course.name}</Link></td>
              <td>{sectionToString(course.section)}</td>
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
                  to={`./${course._id}/edit`}
                  className="btn btn-sm btn-outline-primary w-100"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
