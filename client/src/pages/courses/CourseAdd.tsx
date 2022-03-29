import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import type { CourseData } from "@dohyunkim/common";
import CourseForm from "src/components/CourseForm";
import { gql } from "src/graphql";

const ADD_COURSE = gql(/* GraphQL */`
  mutation AddCourse($data: CourseInput!) {
    addCourse(data: $data) {
      _id
    }
  }
`);

export default function CourseAdd(): JSX.Element {
  const [addCourse, { loading, error }] = useMutation(ADD_COURSE);
  const navigate = useNavigate();

  const onSubmit = async (data?: CourseData): Promise<void> => {
    if (!data) return;
    try {
      const result = await addCourse({ variables: { data }});
      navigate(`/courses/${result.data?.addCourse?._id}`);
    } catch { /* do nothing */ }
  };

  return (
    <main>
      <h1 className="mb-3">Add a Course</h1>
      {error && <div className="alert alert-danger" role="alert">{error.message}</div>}
      <CourseForm
        action="/api/courses"
        method="post"
        className="px-3"
        id="course-create"
        disabled={loading}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <button type="submit" form="course-create" className="btn btn-primary">Create</button>
      </div>
    </main>
  );
}
