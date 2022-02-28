import mongoose, { HydratedDocument } from "mongoose";

import type { CourseData } from "@dohyunkim/common";

type CourseDataNoId = Omit<CourseData, "_id">;

const schema = new mongoose.Schema<CourseDataNoId>(
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
schema.index({ semester: 1, code: 1, section: 1 }, { unique: true });

const Course = mongoose.model("Course", schema);
export default Course;

export type CourseDoc = HydratedDocument<CourseDataNoId>;

export const toClientDataCourse = (data: CourseDoc): CourseData => {
  const { code, name, section, semester } = data.toJSON();
  const _id = data._id.toString();
  return { _id, code, name, section, semester };
};
