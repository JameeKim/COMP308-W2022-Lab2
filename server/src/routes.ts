import { Router, json } from "express";

const api = Router();

const routes = Router();
routes.use("/api", json(), api);
export default routes;
