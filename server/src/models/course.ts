import mongoose, { HydratedDocument } from "mongoose";

import type { CourseData } from "@dohyunkim/common";

const schema = new mongoose.Schema<CourseData>(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
  },
  { timestamps: false },
);

const Course = mongoose.model("Course", schema);
export default Course;

export type CourseDoc = HydratedDocument<CourseData>;
