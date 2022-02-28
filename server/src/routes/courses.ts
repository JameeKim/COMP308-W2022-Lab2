import { Router } from "express";

import { isCourseData } from "@dohyunkim/common";
import { requireAuth } from "~/controllers/auth";
import { findOrAddCourse, getAllCourses, getCourse, updateCourse } from "~/controllers/course";
import { toClientDataCourse } from "~/models/course";

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

  const { course, added } = await findOrAddCourse(input);
  if (added) {
    res.status(201)
      .setHeader("Location", `/api/courses/${course._id}`)
      .send({ status: "ok", data: toClientDataCourse(course) });
  } else {
    res.status(400).send({ error: "duplicate" });
  }
});

// GET /api/courses/:id - Get information about a course
courses.get("/:id", async (req, res) => {
  const course = await getCourse(req.params.id);
  if (!course) {
    res.status(404).send({ error: "not_found" });
  } else {
    res.send({ status: "ok", data: toClientDataCourse(course) });
  }
});

// PUT /api/courses/:id - Update information about the given course
courses.put("/:id", requireAuth, async (req, res) => {
  const course = await getCourse(req.params.id);
  if (!course) {
    return res.status(404).send({ error: "not_found" });
  }

  const input = req.body;
  if (!isCourseData(input)) {
    return res.status(400).send({ error: "bad_data" });
  }

  const result = await updateCourse(course, input);
  if (!result.success) {
    return res.status(400).send({ error: "duplicate" });
  }

  res.status(200).send({ status: "ok", data: toClientDataCourse(course) });
});
