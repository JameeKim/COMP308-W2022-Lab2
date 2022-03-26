import { readFileSync } from "fs";
import path from "path";

import { AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-errors";
import { gql } from "apollo-server-express";
import { DateTimeScalar } from "graphql-date-scalars";

import type { StudentData } from "@dohyunkim/common";

import { projectDir } from "../config/paths";
import Course from "../models/course";
import Student, { StudentDoc } from "../models/student";

import { authorize, deleteTokenCookie, register, writeTokenCookie } from "./auth";
import type {
  CourseResolvers,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  StudentResolvers,
} from "./graphql-resolvers.gen";

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
const queryResolvers: QueryResolvers = {
  whoami: (p, args, { req }) => req.user,
  courses: async () => Course.find(),
  course: async (p, args) => Course.findById(args.id),
  students: async (p, args, { req }) => {
    requireAuth(req.user);
    return Student.find({}, {}, { sort: { idNumber: 1 } });
  },
  student: async (p, { id }, { req }) => {
    requireAuth(req.user);
    if (req.user._id.equals(id)) return req.user;
    return Student.findById(id);
  },
};

/**
 * The mutation resolver
 */
const mutationResolvers: MutationResolvers = {
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
  logout: async (p, args, { res }) => {
    res.setHeader("set-cookie", await deleteTokenCookie());
    return "OK";
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
