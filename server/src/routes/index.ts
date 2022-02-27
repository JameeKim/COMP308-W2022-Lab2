import { Router, json, urlencoded } from "express";

import { cookieParser } from "~/config/cookie";
import getEnv from "~/config/env";

import auth from "./auth";

/**
 * Route handlers for the api routes
 */
const api = Router();
api.use("/auth", auth);

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
  api,
);
