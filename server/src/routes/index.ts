import { Router, json, urlencoded } from "express";
import methodOverride from "method-override";

import { cookieParser } from "~/config/cookie";
import { noCache, onlyAccept } from "~/config/misc";
import { parseUser } from "~/controllers/auth";

import auth from "./auth";
import courses from "./courses";
import students from "./students";

/**
 * Route handlers for the api routes
 */
const api = Router();
api.use(noCache); // disable cache
api.use("/auth", auth);
api.use("/courses", courses);
api.use("/students", students);

/**
 * The base level route handler
 */
const routes = Router();
export default routes;

// Send 415 Unsupported Media Type for requests with a body and something not json/form
routes.use(onlyAccept());

// Body parsers
routes.use(json(), urlencoded({ extended: true }));

// Method overrides to accept requests other than GET and POSTs (client-side limitation)
routes.use(methodOverride("X-HTTP-Method-Override"), methodOverride("_method"));

// Parse the cookie header and the JWT in the cookie
routes.use(cookieParser(), parseUser);

// All api routes
routes.use("/api", api);
