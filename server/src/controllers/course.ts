import type { CourseData } from "@dohyunkim/common";
import Course, { CourseDoc } from "~/models/course";
import Student, { StudentDoc } from "~/models/student";
import type { IdType } from "~/types";

import { getStudentQuery } from "./student";

const toClientDataCourse = (data: CourseDoc): CourseData => {
  const { code, name, section, semester } = data;
  return { code, name, section, semester };
};

export const getAllCourses = async (): Promise<CourseData[]> => {
  const res = await Course.find();
  return res.map(toClientDataCourse);
};

export const getCoursesForStudent = async(student: IdType | StudentDoc): Promise<CourseData[]> => {
  const res = await Student.findOne(getStudentQuery(student), { courses: true })
    .populate<{ courses: CourseDoc[] }>("courses");
  return res ? res.courses.map(toClientDataCourse) : [];
};
