import type { CourseData } from "@dohyunkim/common";
import Course, { CourseDoc, toClientDataCourse } from "~/models/course";
import Student, { StudentDoc } from "~/models/student";
import type { IdType } from "~/types";

import { getStudentQuery } from "./student";

export const getAllCourses = async (): Promise<CourseData[]> => {
  const res = await Course.find({}, {}, { sort: { semester: 1, code: 1, section: 1 } });
  return res.map(toClientDataCourse);
};

export const getCoursesForStudent = async (student: IdType | StudentDoc): Promise<CourseData[]> => {
  const res = await Student.findOne(getStudentQuery(student), { courses: true })
    .populate<{ courses: CourseDoc[] }>({
      path: "courses",
      options: { sort: { semester: 1, code: 1, section: 1 } },
    });
  return res ? res.courses.map(toClientDataCourse) : [];
};

export const getCourse = async (id: IdType): Promise<CourseDoc | null> => {
  return await Course.findById(id);
};

export const addCourseRaw = async (data: CourseData): Promise<CourseDoc> => {
  const course = new Course(data);
  await course.save();
  return course;
};

const getCourseWithInfo = async (
  data: Omit<CourseData, "_id" | "name">,
): Promise<CourseDoc | null> => {
  const { semester, code, section } = data;
  return await Course.findOne({ semester, code, section });
};

type FindOrAddCourseResult = { course: CourseDoc, added: boolean };

export const findOrAddCourse = async (data: CourseData): Promise<FindOrAddCourseResult> => {
  let course = await getCourseWithInfo(data);
  let added = false;

  if (!course) {
    course = await addCourseRaw(data);
    added = true;
  }

  return { course, added };
};

export const updateCourse = async (
  course: CourseDoc | IdType,
  data: CourseData,
): Promise<{ course: CourseDoc | null, success: boolean }> => {
  const c = course instanceof Course ? course : await Course.findById(course);
  if (!c) {
    return { course: null, success: false };
  }

  const d = await getCourseWithInfo(data);
  const success = !d || d._id.equals(c._id);

  if (success) {
    await c.set(data).save();
  }

  return { course: c, success };
};
