import { useCallback, useEffect, useState } from "react";

import type { StudentDataSmall } from "@dohyunkim/common";
import { useFetch } from "src/contexts/fetch";

enum FetchStatus {
  Pending,
  Error,
  Success,
}

interface StudentListItemProps {
  data: StudentDataSmall;
}

function StudentListItem({ data }: StudentListItemProps): JSX.Element {
  return (
    <tr>
      <td>{data.idNumber}</td>
      <td>{data.firstName}</td>
      <td>{data.lastName}</td>
      <td>{data.email}</td>
    </tr>
  );
}

export default function Students(): JSX.Element {
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.Pending);
  const [data, setData] = useState<StudentDataSmall[]>(() => []);
  const { get } = useFetch();

  const fetchData = useCallback(
    async (): Promise<void> => {
      setStatus(FetchStatus.Pending);
      const res = await get("/api/students");
      if (res.status === 200) {
        setData((await res.json()).data);
        setStatus(FetchStatus.Success);
      } else {
        setStatus(FetchStatus.Error);
      }
    },
    [get],
  );

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <main>
      <h1 className="mb-3">Students</h1>
      <button type="button" className="btn btn-secondary" onClick={fetchData}>Fetch Again</button>
      { status === FetchStatus.Pending && <p>Loading...</p> }
      { status === FetchStatus.Error && <p>Error</p> }
      { status !== FetchStatus.Pending && <p>{data.length} students</p> }
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
          {data.map((data) => <StudentListItem key={data.idNumber} data={data} />)}
        </tbody>
      </table>
    </main>
  );
}
