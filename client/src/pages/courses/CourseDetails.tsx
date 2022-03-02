import { Link } from "react-router-dom";

import {
  StudentDataSmallFromServer, courseSectionToNumber, isCourseSectionLike, sectionToString,
} from "@dohyunkim/common";
import { useAuth } from "src/contexts/auth";
import useFetchData from "src/hooks/useFetchData";

import { useCourseContext } from "./SingleCourse";

interface StudentRowProps {
  studentId: string;
}

function StudentRow({ studentId }: StudentRowProps): JSX.Element {
  const { pending, error, data } =
    useFetchData<StudentDataSmallFromServer>(`/api/students/${studentId}`);

  return (
    <tr>
      <td className={error && "text-danger"}>
        {error && "X"}
      </td>
      {pending ? (
        <td rowSpan={3} className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading data...</span>
          </div>
        </td>
      ) : (error || !data) ? (
        <td rowSpan={3} className="text-center text-danger">
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
  const { data, error, refetch } = useCourseContext();
  const { user } = useAuth();

  const notFound = error === "not_found";

  return (
    <main>
      <Link to="/courses/all">&lt; All courses</Link>

      <section>
        <h1 className="mb-3">Course Details</h1>
        <div className="mb-3 d-flex">
          <button type="button" className="btn btn-outline-secondary" onClick={refetch}>
          Fetch Again
          </button>
        </div>
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
          <table className="table table-bordered table-reponsive align-middle">
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
