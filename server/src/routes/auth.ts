import { RequestHandler, Router } from "express";
import { MongoServerError } from "mongodb";

import { isString, isStudentData } from "@dohyunkim/common";

import {
  authorize, deleteTokenCookie, register, requireAuth, requireNoAuth, writeTokenCookie,
} from "../controllers/auth";
import { StudentDoc, toClientData } from "../models/student";

const auth = Router();
export default auth;

/**
 * GET /api/auth/whoami - Return the data of the requesting user
 */
auth.get("/whoami", async (req, res) => {
  const newToken = typeof req.query.t === "string";
  if (req.user && newToken) {
    res.setHeader("Set-Cookie", await writeTokenCookie(req.user._id));
  }
  const data = req.user ? toClientData(req.user, true) : undefined;
  res.status(200).send({ status: "ok", data });
});

/**
 * POST/DELETE /api/auth/logout - Get rid of the token in the cookie
 */
const logout: RequestHandler = async (_req, res) => {
  res.setHeader("Set-Cookie", await deleteTokenCookie());
  res.status(200).send({ status: "ok" });
};
auth.route("/logout")
  .post(logout)
  .delete(logout);

/**
 * POST /api/auth/login - Request for a login
 */
auth.post("/login", requireNoAuth(), async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;

  if (!id || !password || !isString(id) || !isString(password)) {
    return res.status(400).send({ error: "bad_data" });
  }

  try {
    const user = await authorize(id, password);
    if (!user) return res.status(400).send({ error: "credentials" });
    res.setHeader("Set-Cookie", await writeTokenCookie(user._id));
    res.redirect(303, req.accepts("html") ? "/" : "/api/auth/whoami");
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});

/**
 * POST /api/auth/register - Register a user
 */
auth.post("/register", requireNoAuth(), async (req, res) => {
  const input = req.body;
  const password = input && input.password;
  if (input && !input.address) {
    input.address = {
      street: input.street,
      city: input.city,
      province: input.province,
      postalCode: input.postalCode,
    };
  }

  if (!isStudentData(input) || !password) {
    return res.status(400).send({ error: "bad_data" });
  }

  try {
    const user = await register(input, password);
    res.setHeader("Set-Cookie", await writeTokenCookie(user._id));
    res.redirect(303, req.accepts("html") ? "/" : "/api/auth/whoami");
  } catch (e) {
    if (e instanceof MongoServerError) {
      if (e.code === 11000) { // duplicate
        return res.status(400)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .send({ error: "duplicate", fields: Object.keys((e as any).keyPattern)});
      }
    }
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});

/**
 * POST /api/auth/update - Change user information
 */
// TODO change to PUT and move (or duplicate) to students routes
auth.post("/update", requireAuth, async (req, res) => {
  const user = req.user as StudentDoc;

  const input = req.body;
  if (input && !input.address) {
    input.address = {
      street: input.street,
      city: input.city,
      province: input.province,
      postalCode: input.postalCode,
    };
  }

  if (!isStudentData(input)) {
    return res.status(400).send({ error: "bad_data" });
  }

  if (user.idNumber !== input.idNumber) {
    return res.status(403).send({ error: "forbidden" });
  }

  try {
    // TODO move update of user to controller
    await user.set(input).save();
    res.status(200).send({ status: "ok", data: toClientData(user, true) });
  } catch (e) {
    if (e instanceof MongoServerError) {
      if (e.code === 11000) { // duplicate
        return res.status(400)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .send({ error: "duplicate", fields: Object.keys((e as any).keyPattern )});
      }
    }
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});
