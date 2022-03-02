import type { CourseData, CourseDataFromServer } from "@dohyunkim/common";
import Course, { CourseDoc, toClientDataCourse } from "~/models/course";
import Student, { StudentDoc } from "~/models/student";
import type { DataWithFlag, IdType } from "~/types";

import { getStudentQuery } from "./student";

/**
 * Get the list of all courses in the database, ready to be sent to the client
 */
export const getAllCourses = async (): Promise<CourseDataFromServer[]> => {
  const res = await Course.find({}, {}, { sort: { semester: 1, code: 1, section: 1 } });
  return res.map(toClientDataCourse);
};

/**
 * Get the list of all courses for a student, ready to be sent to the client
 */
export const getCoursesForStudent = async (
  student: IdType | StudentDoc,
): Promise<CourseDataFromServer[]> => {
  const res = await Student.findOne(getStudentQuery(student), { courses: true })
    .populate<{ courses: CourseDoc[] }>({
      path: "courses",
      options: { sort: { semester: 1, code: 1, section: 1 } },
    });
  return res ? res.courses.map(toClientDataCourse) : [];
};

/**
 * Find a course document with the given id
 */
export const getCourse = async (id: IdType): Promise<CourseDoc | null> => {
  return await Course.findById(id);
};

/**
 * Try adding a new course with the given inputs
 *
 * This throws an error when there is a duplicate, so use this with care.
 */
export const addCourseRaw = async (data: CourseData): Promise<CourseDoc> => {
  const course = new Course(data);
  await course.save();
  return course;
};

// Find a course document with the given unique-key combination
const getCourseWithInfo = async (
  data: Pick<CourseData, "semester" | "code" | "section">,
): Promise<CourseDoc | null> => {
  const { semester, code, section } = data;
  return await Course.findOne({ semester, code, section });
};

/**
 * Try to add a new course, but return the existing one if there is one without creating a duplicate
 */
export const findOrAddCourse = async (
  data: CourseData,
): Promise<DataWithFlag<CourseDoc, "added">> => {
  let course = await getCourseWithInfo(data);
  let added = false;

  if (!course) {
    course = await addCourseRaw(data);
    added = true;
  }

  return { data: course, added };
};

/**
 * Update the course with the given data, but don't do anything if there is already a duplicate
 *
 * The data in the returned type is:
 * - `null` when the course with provided id doesn't exist, never if document is provided
 * - the updated course document if successfully updated
 * - the already existing course document if there is a duplicate
 */
export function updateCourse(
  course: IdType,
  data: CourseData,
): Promise<DataWithFlag<CourseDoc | null>>;

export function updateCourse(
  course: CourseDoc,
  data: CourseData,
): Promise<DataWithFlag<CourseDoc>>;

export async function updateCourse(
  course: IdType | CourseDoc,
  data: CourseData,
): Promise<DataWithFlag<CourseDoc | null>> {
  const c = course instanceof Course ? course : await Course.findById(course);
  if (!c) {
    return { data: null, success: false };
  }

  const d = await getCourseWithInfo(data);
  const success = !d || d._id.equals(c._id);

  if (success) {
    await c.set(data).save();
  }

  return { data: success ? c : d, success };
}
