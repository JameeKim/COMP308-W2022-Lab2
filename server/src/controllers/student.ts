import type { FilterQuery } from "mongoose";

import type { StudentDataSmallFromServer } from "@dohyunkim/common";

import Student, { StudentDataServer, StudentDoc, toClientData } from "../models/student";
import type { IdType } from "../types";

/**
 * Get the list of all students in the database, ready to be sent to the client
 */
export const getAllStudents = async (): Promise<StudentDataSmallFromServer[]> => {
  const res = await Student.find({}, {}, { sort: { idNumber: 1 } });
  return res.map((doc) => toClientData(doc, false));
};

/**
 * Get the list of all students in a course, ready to be sent to the client
 */
export const getStudentsInCourse = async (
  courseId: IdType,
): Promise<StudentDataSmallFromServer[]> => {
  const res = await Student.find({ courses: courseId }, {}, { sort: { idNumber: 1 } });
  return res.map((doc) => toClientData(doc, false));
};

// Get a query filter for a student with the given id/idNumber
export const getStudentQuery = (student: IdType | StudentDoc): FilterQuery<StudentDataServer> => {
  return student instanceof Student
    ? { _id: student._id }
    : { $or: [{ _id: student }, { idNumber: student }] };
};

/**
 * Return a data of the student with the given id
 */
export const getStudent = async (studentId: IdType): Promise<StudentDoc | null> => {
  return await Student.findOne(getStudentQuery(studentId));
};

/**
 * Add given courses to the student
 */
export const addCourseToStudent = async (
  student: IdType | StudentDoc,
  ...courseIds: IdType[]
): Promise<StudentDoc | null> => await Student.findOneAndUpdate(
  getStudentQuery(student),
  { $addToSet: { courses: { $each: courseIds } } },
);

/**
 * Remove given courses from the student
 */
export const dropCourseFromStudent = async (
  student: IdType | StudentDoc,
  ...courseIds: IdType[]
): Promise<StudentDoc | null> => await Student.findOneAndUpdate(
  getStudentQuery(student),
  { $pullAll: { courses: courseIds } },
);
