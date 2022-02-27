import { Router } from "express";

import { requireAuth } from "~/controllers/auth";
import { getAllStudents } from "~/controllers/student";

const students = Router();
export default students;

// GET /api/students - Get list of all students
students.get("/", requireAuth, async (req, res) => {
  try {
    const data = await getAllStudents();
    res.send({ status: "ok", data });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});
