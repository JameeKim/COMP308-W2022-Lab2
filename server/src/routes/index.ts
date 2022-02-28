import { Router, json, urlencoded } from "express";
import methodOverride from "method-override";

import { cookieParser } from "~/config/cookie";
import getEnv from "~/config/env";
import { noCache } from "~/config/misc";

import auth from "./auth";
import courses from "./courses";
import students from "./students";

/**
 * Route handlers for the api routes
 */
const api = Router();
api.use("/auth", auth);
api.use("/courses", courses);
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
  methodOverride("X-HTTP-Method-Override"),
  methodOverride("_method"),
  cookieParser({ keys: getEnv().COOKIE_SECRET }),
  noCache,
  api,
);
