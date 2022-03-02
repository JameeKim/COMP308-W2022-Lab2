import { Link } from "react-router-dom";

import type { StudentDataSmallFromServer } from "@dohyunkim/common";
import PageLoading from "src/components/PageLoading";
import useFetchData, { FetchStatus } from "src/hooks/useFetchData";

export default function Students(): JSX.Element {
  const { status, pending, data, refetch } =
    useFetchData<StudentDataSmallFromServer[]>("/api/students");

  return (
    <main>
      <h1 className="mb-3">Students</h1>
      <div className="d-flex mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={pending}
          onClick={refetch}
        >
          Fetch Again
        </button>
      </div>
      <PageLoading show={pending} />
      {status === FetchStatus.Error && <p>Error</p>}
      <p>{data?.length ?? 0} students</p>
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
          {data?.map((data) => (
            <tr key={data._id}>
              <td>{data.idNumber}</td>
              <td>{data.lastName}, {data.firstName}</td>
              <td>{data.email}</td>
              <td>
                <Link
                  to={`/students/${data._id}`}
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
