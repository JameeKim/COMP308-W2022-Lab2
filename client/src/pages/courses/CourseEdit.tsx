import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CourseData } from "@dohyunkim/common";
import CourseForm from "src/components/CourseForm";
import { useFetch } from "src/contexts/fetch";

import { useCourseContext } from "./SingleCourse";

const errorMessages: Record<string, string> = {
  not_found: "The course doesn't exist",
  bad_data: "Form validation failed",
  duplicate: "The course already exists with same semester, code, and section combination",
};

export default function CourseEdit(): JSX.Element {
  const { id, pending, error, data } = useCourseContext();
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { put } = useFetch();
  const navigate = useNavigate();

  const url = `/api/courses/${id}`;

  const onSubmit = async (data?: CourseData): Promise<void> => {
    if (!data) return;

    setSending(true);
    const res = await put(url, { data });
    const body = await res.json();
    setSubmitError(body.error ?? "");
    if (res.status === 200) {
      navigate(url);
    }
    setSending(false);
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
      {(error || submitError) && (
        <div className="alert alert-danger" role="alert">
          {errorMessages[error] ?? errorMessages[submitError] ?? "Unknown error occurred"}
        </div>
      )}
      <CourseForm
        action={url}
        method="PUT"
        className="mx-3"
        id="course-edit"
        disabled={pending || sending}
        data={data}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <button
          type="submit"
          form="course-edit"
          className="btn btn-primary"
          disabled={pending || sending}
        >
          Update
        </button>
      </div>
    </main>
  );
}
