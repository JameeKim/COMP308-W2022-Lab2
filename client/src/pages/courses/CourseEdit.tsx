import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import type { CourseData } from "@dohyunkim/common";
import CourseForm from "src/components/CourseForm";
import { gql } from "src/graphql";

import { useCourseContext } from "./SingleCourse";

const UPDATE_COURSE = gql(/* GraphQL */`
  mutation UpdateCourse($id: ID!, $data: CourseInput!) {
    updateCourse(id: $id, data: $data) {
      _id
    }
  }
`);

export default function CourseEdit(): JSX.Element {
  const { id, loading, error, data } = useCourseContext();
  const [updateCourse, update] = useMutation(UPDATE_COURSE);
  const navigate = useNavigate();

  const url = `/api/courses/${id}`;

  const onSubmit = async (data?: CourseData): Promise<void> => {
    if (!data) return;
    try {
      await updateCourse({ variables: { id, data } });
      navigate(`/courses/${id}`);
    } catch { /* do nothing */ }
  };

  if (!id) {
    return (
      <div className="alert alert-dange">
        The <code>id</code> parameter in the url should be set.
      </div>
    );
  }

  return (
    <main>
      <h1 className="mb-3">Edit Course</h1>
      {(error || update.error) && (
        <div className="alert alert-danger" role="alert">
          {error ?? update.error?.message ?? "Unknown error occurred"}
        </div>
      )}
      <CourseForm
        action={url}
        method="PUT"
        className="mx-3"
        id="course-edit"
        disabled={loading || update.loading}
        data={data}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <button
          type="submit"
          form="course-edit"
          className="btn btn-primary"
          disabled={loading || update.loading}
        >
          Update
        </button>
      </div>
    </main>
  );
}
