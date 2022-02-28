import type { StudentDataSmall } from "@dohyunkim/common";
import useFetchData, { FetchStatus } from "src/hooks/useFetchData";

export default function Students(): JSX.Element {
  const { status, data, refetch } = useFetchData<StudentDataSmall[]>("/api/students");

  return (
    <main>
      <h1 className="mb-3">Students</h1>
      <div className="d-flex mb-3">
        <button type="button" className="btn btn-secondary" onClick={refetch}>Fetch Again</button>
      </div>
      {status === FetchStatus.Pending && <p>Loading...</p>}
      {status === FetchStatus.Error && <p>Error</p>}
      {status !== FetchStatus.Pending && <p>{data?.length} students</p>}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Student ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email Address</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((data) => (
            <tr key={data._id}>
              <td>{data.idNumber}</td>
              <td>{data.firstName}</td>
              <td>{data.lastName}</td>
              <td>{data.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
