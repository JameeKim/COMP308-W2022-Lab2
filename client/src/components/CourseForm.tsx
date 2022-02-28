import { ComponentPropsWithoutRef, FormEventHandler, forwardRef, useCallback } from "react";

import {
  CourseData, courseSectionToNumber, isCourseData, isCourseSectionLike,
} from "@dohyunkim/common";

import Label from "./form/Label";

type CourseFormPropsBase = Omit<ComponentPropsWithoutRef<"form">, "onSubmit" | "children">;

export interface CourseFormProps extends CourseFormPropsBase {
  data?: CourseData | null | undefined;
  disabled?: boolean | undefined;
  onSubmit?: (data?: CourseData) => void;
}

const CourseForm = forwardRef<HTMLFormElement, CourseFormProps>((
  { data, disabled, onSubmit, children, ...props },
  ref,
) => {
  const submitHandler: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    if (!onSubmit) return;
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const semester = formData.get("semester") || undefined;
    const code = formData.get("code") || undefined;
    const name = formData.get("name") || undefined;
    let section: unknown = formData.get("section") || undefined;

    if (isCourseSectionLike(section)) {
      section = courseSectionToNumber(section);
    }

    const data = { semester, code, name, section };
    onSubmit(isCourseData(data) ? data : undefined);
  }, [onSubmit]);

  return (
    <form ref={ref} onSubmit={submitHandler} {...props}>
      <div className="row">
        <div className="mb-3 col-12 col-sm">
          <Label htmlFor="course-semester" className="form-label" required>Semester</Label>
          <input
            type="text"
            name="semester"
            id="course-semester"
            className="form-control"
            defaultValue={data?.semester}
            pattern="(F|W|M)[0-9]{4}"
            placeholder="ex) W2022"
            required
            disabled={disabled}
            aria-disabled={disabled}
          />
        </div>
        <div className="mb-3 col-12 col-sm">
          <Label htmlFor="course-code" className="form-label" required>Code</Label>
          <input
            type="text"
            name="code"
            id="course-code"
            className="form-control"
            defaultValue={data?.code}
            pattern="[A-Z]{4}[0-9]{3}"
            placeholder="ex) COMP308"
            required
            disabled={disabled}
            aria-disabled={disabled}
          />
        </div>
        <div className="mb-3 col-12 col-sm">
          <Label htmlFor="couse-section" className="form-label" required>Section</Label>
          <input
            type="text"
            name="section"
            id="course-section"
            className="form-control"
            defaultValue={data?.section}
            pattern="([1-9][0-9][0-9])|([0-9][1-9][0-9])|(00[1-9])"
            placeholder="ex) 003"
            required
            disabled={disabled}
            aria-disabled={disabled}
          />
        </div>
      </div>
      <div className="mb-3">
        <Label htmlFor="course-name" className="form-label" required>Name</Label>
        <input
          type="text"
          name="name"
          id="course-name"
          className="form-control"
          defaultValue={data?.name}
          required
          disabled={disabled}
          aria-disabled={disabled}
        />
      </div>
    </form>
  );
});
CourseForm.displayName = "CourseForm";

export default CourseForm;
