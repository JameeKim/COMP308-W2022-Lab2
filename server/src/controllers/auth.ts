import { compare, hash } from "bcrypt";
import type { RequestHandler } from "express";
import { JwtPayload, Secret, SignOptions, VerifyOptions, sign, verify } from "jsonwebtoken";
import type { Types } from "mongoose";

import type { StudentData } from "@dohyunkim/common";
import { BCRYPT_SALT_ROUNDS, TOKEN_VALID_PERIOD } from "~/config/auth";
import { destroyCookie, writeCookie } from "~/config/cookie";
import getEnv from "~/config/env";
import Student, { StudentDoc } from "~/models/student";

interface Payload extends JwtPayload {
  id: string;
}

// Promisify the sign function of jwt
const signAsync = (
  payload: string | object | Buffer,
  secret: Secret,
  options: SignOptions = {},
): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(payload, secret, options, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res as string);
      }
    });
  });
};

// Promisify the verify function of jwt
const verifyAsync = (
  token: string,
  secret: Secret,
  options: VerifyOptions = {},
): Promise<Payload> => {
  return new Promise((resolve, reject) => {
    verify(token, secret, options, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res as Payload);
      }
    });
  });
};

/**
 * Verify the current user
 */
export const healthCheck = async (cookies: NodeJS.Dict<string>): Promise<StudentDoc | null> => {
  const token = cookies[getEnv().JWT_COOKIE_NAME];
  if (!token) return null;

  let decoded: Payload;
  try {
    decoded = await verifyAsync(token, getEnv().JWT_SECRET, { maxAge: TOKEN_VALID_PERIOD });
  } catch (e) {
    console.error(e);
    return null;
  }

  return await Student.findById(decoded.id);
};

// Type-augmenting for express request object to add the user object
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: StudentDoc;
    }
  }
}

/**
 * Middleware that sends 401 if the user is not logged in
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  const user = await healthCheck(req.cookies);
  if (!user) return res.status(401).send();
  req.user = user;
  next();
};

/**
 * Check the login credentials
 */
export const authorize = async (id: string, password: string): Promise<StudentDoc | null> => {
  const user = await Student.findOne({ idNumber: id });
  if (!user) return null;
  const result = await compare(password, user.password);
  return result ? user : null;
};

/**
 * Insert the new user
 */
export const register = async (user: StudentData, password: string): Promise<StudentDoc> => {
  user.password = await hash(password, BCRYPT_SALT_ROUNDS);
  const student = new Student(user);
  await student.save();
  return student;
};

/**
 * Create a cookie string with the JWT token
 */
export const writeTokenCookie = async (userId: Types.ObjectId | string): Promise<string> => {
  const id = typeof userId === "string" ? userId : userId.toString();
  const token = await signAsync({ id }, getEnv().JWT_SECRET, { expiresIn: TOKEN_VALID_PERIOD });
  return writeCookie(getEnv().JWT_COOKIE_NAME, token, TOKEN_VALID_PERIOD);
};

/**
 * Delete the cookie for the token
 */
export const deleteTokenCookie = async (): Promise<string> => {
  return destroyCookie(getEnv().JWT_COOKIE_NAME);
};
