import { Router } from "express";

import { isCourseData } from "@dohyunkim/common";

import { requireAuth } from "../controllers/auth";
import { findOrAddCourse, getAllCourses, getCourse, updateCourse } from "../controllers/course";
import { getStudentsInCourse } from "../controllers/student";
import { toClientDataCourse } from "../models/course";

const courses = Router();
export default courses;

// GET /api/courses - Get the list of all courses
courses.get("/", async (_req, res) => {
  const data = await getAllCourses();
  res.send({ status: "ok", data });
});

// POST /api/courses - Create a new course
courses.post("/", requireAuth, async (req, res) => {
  const input = req.body;

  if (!isCourseData(input)) {
    return res.status(400).send({ error: "bad_data" });
  }

  const { data: course, added } = await findOrAddCourse(input);
  if (added) {
    res.status(201)
      .setHeader("Location", `/api/courses/${course._id}`)
      .send({ status: "ok", data: toClientDataCourse(course) });
  } else {
    res.status(400).send({ error: "duplicate", exists: course._id.toString() });
  }
});

// GET /api/courses/:id - Get information about a course
courses.get("/:id", async (req, res) => {
  const course = await getCourse(req.params.id);
  if (!course) {
    return res.status(404).send({ error: "not_found", what: "courses" });
  }

  const data = toClientDataCourse(course);

  // Also get list of students if signed in
  if (req.user) {
    const students = await getStudentsInCourse(course._id);
    data.students = students.map((s) => s._id);
  }

  res.send({ status: "ok", data });
});

// PUT /api/courses/:id - Update information about the given course
courses.put("/:id", requireAuth, async (req, res) => {
  const course = await getCourse(req.params.id);
  if (!course) {
    return res.status(404).send({ error: "not_found", what: "courses" });
  }

  const input = req.body;
  if (!isCourseData(input)) {
    return res.status(400).send({ error: "bad_data" });
  }

  const result = await updateCourse(course, input);
  if (!result.success) {
    return res.status(400).send({ error: "duplicate", exists: result.data._id.toString() });
  }

  res.status(200).send({ status: "ok", data: toClientDataCourse(course) });
});

// GET /api/courses/:id/students - Get a list of students taking the course
courses.get("/:id/students", requireAuth, async (req, res) => {
  const course = await getCourse(req.params.id);
  if (!course) {
    return res.status(404).send({ error: "not_found", what: "courses" });
  }

  const result = await getStudentsInCourse(req.params.id);
  res.status(200).send({ status: "ok", data: result });
});
