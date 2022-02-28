import { serialize as serializeCookie } from "cookie";
import { sign as signCookie } from "cookie-signature";
import { Router } from "express";
import { MongoServerError } from "mongodb";

import { isString, isStudentData } from "@dohyunkim/common";
import getEnv from "~/config/env";
import {
  authorize, deleteTokenCookie, healthCheck, register, requireAuth, writeTokenCookie,
} from "~/controllers/auth";
import { StudentDoc, toClientData } from "~/models/student";

const auth = Router();
export default auth;

auth.get("/test", (req, res) => {
  res.send({
    headers: req.headers,
    cookies: req.cookies,
    signedCookies: req.signedCookies,
  });
});

auth.get("/test2", (req, res) => {
  const cookieVal = signCookie("Hi!!", getEnv().COOKIE_SECRET[0]);
  const setCookie = serializeCookie("testing", cookieVal, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5,
  });
  res.setHeader("Set-Cookie", setCookie).send({
    headers: req.headers,
    cookies: req.cookies,
    signedCookies: req.signedCookies,
  });
});

// GET /api/auth/whoami - Return the data of the requesting user
auth.get("/whoami", async (req, res) => {
  const user = await healthCheck(req.cookies);
  if (user) {
    res.setHeader("Set-Cookie", await writeTokenCookie(user._id));
  }
  res.status(200).send({ status: "ok", data: user ? toClientData(user, true) : undefined });
});

// POST /api/auth/logout - Get rid of the token in the cookie
auth.post("/logout", async (req, res) => {
  const cookie = await deleteTokenCookie();
  res.status(302)
    .setHeader("Location", "/")
    .setHeader("Set-Cookie", cookie)
    .send();
});

// POST /api/auth/login - Request for a login
auth.post("/login", async (req, res) => {
  const user = await healthCheck(req.cookies);
  if (user) {
    const cookie = await writeTokenCookie(user._id);
    return res.status(302)
      .setHeader("Location", "/")
      .setHeader("Set-Cookie", cookie)
      .send();
  }

  const id = req.body.id;
  const password = req.body.password;

  if (!id || !password || !isString(id) || !isString(password)) {
    return res.status(400).send({ error: "bad_data" });
  }

  try {
    const user = await authorize(id, password);
    if (!user) {
      return res.status(400).send({ error: "credentials" });
    }

    const cookie = await writeTokenCookie(user._id);
    res.status(302)
      .setHeader("Location", "/")
      .setHeader("Set-Cookie", cookie)
      .send();
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});

// POST /api/auth/register - Register a user
auth.post("/register", async (req, res) => {
  const user = await healthCheck(req.cookies);
  if (user) {
    const cookie = await writeTokenCookie(user._id);
    return res.status(302)
      .setHeader("Location", "/")
      .setHeader("Set-Cookie", cookie)
      .send();
  }

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
    const cookie = await writeTokenCookie(user._id);
    res.status(302)
      .setHeader("Set-Cookie", cookie)
      .setHeader("Location", "/")
      .send();
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

// POST /api/auth/update - Change user information
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
    return res.status(403).send();
  }

  try {
    await user.set(input).save();
    res.status(200).send({ status: "ok", data: toClientData(user, true) });
  } catch (e) {
    if (e instanceof MongoServerError) {
      if (e.code === 11000) {
        return res.status(400)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .send({ error: "duplicate", fields: Object.keys((e as any).keyPattern )});
      }
    }
    console.error(e);
    res.status(500).send({ error: "internal" });
  }
});
