import { readFileSync } from "fs";
import path from "path";

import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-errors";
import { gql } from "apollo-server-express";
import { DateTimeScalar } from "graphql-date-scalars";

import type { StudentData } from "@dohyunkim/common";

import { projectDir } from "../config/paths";
import Course from "../models/course";
import Student, { StudentDoc } from "../models/student";

import { authorize, deleteTokenCookie, register, writeTokenCookie } from "./auth";
import { findOrAddCourse, getCourse, updateCourse } from "./course";
import type {
  CourseResolvers,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  StudentResolvers,
} from "./graphql-resolvers.gen";
import { addCourseToStudent, dropCourseFromStudent, getStudent } from "./student";

const gqlSchemaPath = path.resolve(projectDir, "common", "schema.graphql");

/**
 * The type def built from the graphql schema file
 */
export const typeDefs = gql(readFileSync(gqlSchemaPath).toString("utf-8"));

/**
 * Require the user to be logged in
 */
function requireAuth(user: StudentDoc | null): asserts user {
  if (!user) throw new AuthenticationError("Please log in");
}

/**
 * Require the user to be logged out
 */
function requireNoAuth(user: StudentDoc | null): asserts user is null {
  if (user) throw new AuthenticationError("You are already logged in");
}

/**
 * The query resolver
 */
const queryResolvers: Required<QueryResolvers> = {
  whoami: (p, args, { req }) => req.user,
  courses: async () => Course.find(),
  course: async (p, args) => Course.findById(args.id),
  students: async (p, args, { req }) => {
    requireAuth(req.user);
    return Student.find({}, {}, { sort: { idNumber: 1 } });
  },
  student: async (p, { id }, { req }) => {
    requireAuth(req.user);
    if (req.user._id.equals(id) || req.user.idNumber === id) return req.user;
    return getStudent(id);
  },
};

/**
 * The mutation resolver
 */
const mutationResolvers: Required<MutationResolvers> = {
  register: async (p, { data, password }, { req, res }) => {
    requireNoAuth(req.user);
    const user = await register(data as StudentData, password);
    if (!user) throw new UserInputError("Student ID or email already exists");
    res.setHeader("set-cookie", await writeTokenCookie(user._id));
    req.user = user;
    return user;
  },
  login: async (p, { id, password }, { req, res }) => {
    requireNoAuth(req.user);
    const user = await authorize(id, password);
    if (!user) throw new AuthenticationError("Invalid credentials");
    res.setHeader("set-cookie", await writeTokenCookie(user._id));
    req.user = user;
    return user;
  },
  logout: async (p, args, { req, res }) => {
    res.setHeader("set-cookie", await deleteTokenCookie());
    return !!req.user;
  },
  updateUserInfo: async (p, { data }, { req }) => {
    requireAuth(req.user);
    if (req.user.idNumber !== data.idNumber)
      throw new ForbiddenError("Not allowed to change student ID");
    if (req.user.email !== data.email) {
      const emailExists = await Student.count({ email: data.email });
      if (emailExists > 0) throw new UserInputError("That email already exists");
    }
    await req.user.set(data).save();
    return req.user;
  },
  addCourse: async (p, { data }, { req }) => {
    requireAuth(req.user);
    const { data: course, added } = await findOrAddCourse(data);
    if (!added) throw new UserInputError(`Course ${course._id} already has duplicate data`);
    return course;
  },
  updateCourse: async (p, { id, data }, { req }) => {
    requireAuth(req.user);
    const course = await getCourse(id);
    if (!course) throw new UserInputError(`Course ${id} not found`);
    const { data: c, success } = await updateCourse(course, data);
    if (!success) throw new UserInputError(`Course ${c._id} already has duplicate data`);
    return c;
  },
  enrolCourse: async (p, { courseId }, { req }) => {
    requireAuth(req.user);
    const course = await getCourse(courseId);
    if (!course) throw new UserInputError(`Course ${courseId} not found`);
    const result = await addCourseToStudent(req.user, course._id);
    if (!result) throw new ApolloError(`Failed to add course ${courseId}`);
    return Course.find({ _id: { $in: result.courses } });
  },
  dropCourse: async (p, { courseId }, { req }) => {
    requireAuth(req.user);
    if (!req.user.courses.some(cid => cid.equals(courseId)))
      throw new UserInputError(`Course ${courseId} does not exist in your list of courses`);
    const result = await dropCourseFromStudent(req.user, courseId);
    if (!result) throw new ApolloError(`Failed to drop course ${courseId}`);
    return Course.find({ _id: { $in: result.courses } });
  },
};

function requireSameUser(data: StudentDoc, user: StudentDoc | null): asserts user {
  requireAuth(user);
  if (!user._id.equals(data._id)) throw new ForbiddenError("Not allowed");
}

/**
 * Field resolvers for Student
 */
const studentResolvers: StudentResolvers = {
  address: (p, args, { req }) => {
    requireSameUser(p, req.user);
    return { ...p.address, __typename: "Address" };
  },
  phone: (p, args, { req }) => {
    requireSameUser(p, req.user);
    return p.phone ?? null;
  },
  program: (p, args, { req }) => {
    requireSameUser(p, req.user);
    return p.program ?? null;
  },
  courses: async (p, args, { req }) => {
    requireAuth(req.user);
    return Course.find(
      { _id: { $in: p.courses } },
      {},
      { sort: { semester: 1, code: 1, section: 1 } },
    );
  },
};

/**
 * Field resolvers for Course
 */
const courseResolvers: CourseResolvers = {
  students: async (p, args, { req }) => {
    requireAuth(req.user);
    return Student.find(
      { courses: p._id },
      {},
      { sort: { idNumber: 1 } },
    );
  },
};

/**
 * The root resolver
 */
export const resolvers: Resolvers = {
  Date: DateTimeScalar,
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Student: studentResolvers,
  Course: courseResolvers,
};
