import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CourseData } from "@dohyunkim/common";
import CourseForm from "src/components/CourseForm";
import { useFetch } from "src/contexts/fetch";

export default function CourseAdd(): JSX.Element {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { post } = useFetch();
  const navigate = useNavigate();

  const onSubmit = async (data?: CourseData): Promise<void> => {
    if (!data) return;

    setPending(true);
    const res = await post("/api/courses", { data });
    const body = await res.json();
    setError(body.error ?? "");
    if (res.status >= 200 && res.status < 300) {
      navigate(`/courses/${body.data._id}`);
    }
    setPending(false);
  };

  const errMsg = error === "duplicate"
    ? "The course already exists!"
    : error === "bad_data"
      ? "Data validation failed"
      : error
        ? "Unknown error occurred"
        : "";

  return (
    <main>
      <h1 className="mb-3">Add a Course</h1>
      {errMsg && (<div className="alert alert-danger" role="alert">{errMsg}</div>)}
      <CourseForm
        action="/api/courses"
        method="post"
        className="px-3"
        id="course-create"
        disabled={pending}
        aria-disabled={pending}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <button type="submit" form="course-create" className="btn btn-primary">Create</button>
      </div>
    </main>
  );
}
