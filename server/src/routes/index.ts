import { Router, json, urlencoded } from "express";

import { noCache } from "~/config/cache";
import { cookieParser } from "~/config/cookie";
import getEnv from "~/config/env";

import auth from "./auth";
import students from "./students";

/**
 * Route handlers for the api routes
 */
const api = Router();
api.use("/auth", auth);
api.use("/students", students);

/**
 * The base level route handler
 */
const routes = Router();
export default routes;

routes.use(
  "/api",
  json(),
  urlencoded({ extended: true }),
  cookieParser({ keys: getEnv().COOKIE_SECRET }),
  noCache,
  api,
);
