import type { RequestHandler } from "express";

export const noCache: RequestHandler = (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

export const onlyAccept = (...types: string[]): RequestHandler => {
  if (types.length < 1) {
    types = ["application/json", "application/x-www-form-urlencoded"];
  }

  return (req, res, next) => {
    if (req.is(types) === false) {
      return res.status(415).send({ error: "unsupported_type", supported: types });
    }
    next();
  };
};
