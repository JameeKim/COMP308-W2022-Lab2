import { parse, serialize } from "cookie";
import { sign, unsign } from "cookie-signature";
import type { RequestHandler } from "express";

import getEnv from "./env";

export interface CookieParserOptions {
  keys?: string[];
}

export function cookieParser(options: CookieParserOptions): RequestHandler {
  return (req, _res, next) => {
    const keys = !options.keys || options.keys.length == 0 ? getEnv().COOKIE_SECRET : options.keys;
    const cookies = parse(req.headers.cookie ?? "");
    const unsigned: NodeJS.Dict<string> = {};

    for (const key in cookies) {
      let parsed: string | false = false;

      for (const secret of keys) {
        parsed = unsign(cookies[key], secret);
        if (parsed) break;
      }

      if (parsed) {
        unsigned[key] = parsed;
      } else if (process.env.NODE_ENV === "development") {
        console.log(`Failed to parse cookie "${key}"`);
      }
    }

    req.cookies = unsigned;

    next();
  };
}

export const writeCookie = (key: string, value: string, maxAge: number): string => {
  const signed = sign(value, getEnv().COOKIE_SECRET[0]);
  return serialize(key, signed, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge,
  });
};

export const destroyCookie = (key: string): string => serialize(key, "", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 0,
});
