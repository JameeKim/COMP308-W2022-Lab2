import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import PageLoading from "src/components/PageLoading";
import { gql } from "src/graphql";

const STUDENTS_ALL = gql(/* GraphQL */`
  query StudentsAll {
    students {
      ...StudentOther
    }
  }
`);

export default function Students(): JSX.Element {
  const { loading, error, data, refetch } = useQuery(STUDENTS_ALL);

  const onRefetchClick = useCallback(
    (): void => { refetch(); },
    [refetch],
  );

  return (
    <main>
      <h1 className="mb-3">Students</h1>
      <div className="d-flex mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={loading}
          onClick={onRefetchClick}
        >
          Fetch Again
        </button>
      </div>
      <PageLoading show={loading} />
      {error && <p className="alert alert-danger" role="alert">{error.message}</p>}
      <p>{data?.students.length ?? 0} students</p>
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col">Student ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email Address</th>
            <th scope="col"><span className="visually-hidden">View Details</span></th>
          </tr>
        </thead>
        <tbody>
          {data?.students.map((student) => (
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
    </main>
  );
}
