import type { FilterQuery } from "mongoose";

import type { StudentDataSmall } from "@dohyunkim/common";
import Student, { StudentDataServer, StudentDoc, toClientData } from "~/models/student";
import type { IdType } from "~/types";

export const getAllStudents = async (): Promise<StudentDataSmall[]> => {
  const res = await Student.find({}, {}, { sort: { idNumber: 1 } });
  return res.map((doc) => toClientData(doc, false));
};

export const getStudentsInCourse = async (courseId: IdType): Promise<StudentDataSmall[]> => {
  const res = await Student.find({ courses: courseId });
  return res.map((doc) => toClientData(doc, false));
};

export const getStudentQuery = (student: IdType | StudentDoc): FilterQuery<StudentDataServer> => {
  const id = (student instanceof Student ? student._id : student) as IdType;
  return {
    $or: [
      { _id: id },
      { idNumber: id },
    ],
  };
};

/**
 * Return a data of the student with the given id
 */
export const getStudent = async (studentId: IdType): Promise<StudentDoc | null> => {
  return await Student.findOne(getStudentQuery(studentId));
};

export const addCourseToStudent = async (
  student: IdType | StudentDoc,
  ...courseIds: IdType[]
): Promise<StudentDoc | null> => await Student.findOneAndUpdate(
  getStudentQuery(student),
  { $addToSet: { courses: { $each: courseIds } } },
);

export const dropCourseFromStudent = async (
  student: IdType | StudentDoc,
  ...courseIds: IdType[]
): Promise<StudentDoc | null> => await Student.findOneAndUpdate(
  getStudentQuery(student),
  { $pullAll: { courses: courseIds } },
);
