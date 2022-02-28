import { Router } from "express";

import { requireAuth } from "~/controllers/auth";
import { getCourse, getCoursesForStudent } from "~/controllers/course";
import {
  addCourseToStudent, dropCourseFromStudent, getAllStudents, getStudent,
} from "~/controllers/student";
import { toClientData } from "~/models/student";

const students = Router();
export default students;

// GET /api/students - Get list of all students
students.get("/", requireAuth, async (_req, res) => {
  try {
    const data = await getAllStudents();
    res.send({ status: "ok", data });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});

// GET /api/students/:id - Get the student info
students.get("/:id", requireAuth, async (req, res) => {
  if (req.user?._id?.equals(req.params.id)) {
    return res.status(200).send({ status: "ok", data: toClientData(req.user, true) });
  }

  const student = await getStudent(req.params.id);
  if (!student) {
    return res.status(404).send({ error: "not_found" });
  }

  res.status(200).send({ status: "ok", data: toClientData(student, false) });
});

// GET /api/students/:id/courses - Get a list of courses the student is enrolled in
students.get("/:id/courses", requireAuth, async (req, res) => {
  const student = await getStudent(req.params.id);
  if (!student) {
    return res.status(404).send({ error: "not_found", what: "students" });
  }

  const data = await getCoursesForStudent(student);
  res.status(200).send({ status: "ok", data });
});

// PUT /api/students/:id/courses/:cid - Add the course to the student
students.put("/:id/courses/:cid", requireAuth, async (req, res) => {
  if (!req.user?._id?.equals(req.params.id)) {
    return res.status(403).send({ error: "forbidden" });
  }

  const course = await getCourse(req.params.cid);
  if (!course) {
    return res.status(404).send({ error: "not_found", what: "courses" });
  }

  const result = await addCourseToStudent(req.user, course._id);
  if (!result) {
    return res.status(500).send({ error: "internal" });
  }

  res.status(200).send({ status: "ok", data: result });
});

// DELETE /api/students/:id/courses/:cid - Drop the given course from the student
students.delete("/:id/courses/:cid", requireAuth, async (req, res) => {
  if (!req.user?._id?.equals(req.params.id)) {
    return res.status(403).send({ error: "forbidden" });
  }

  const course = await getCourse(req.params.cid);
  if (!course) {
    return res.status(400).send({
      error: "bad_data",
      message: `Course ${req.params.cid} doesn't exist`,
    });
  }

  const result = await dropCourseFromStudent(req.user, course._id);
  if (!result) {
    return res.status(500).send({ error: "internal" });
  }

  res.status(200).send({ status: "ok", data: result });
});
