export interface EnvVars {
  DB_URI: string,
  COOKIE_SECRET: string[];
  JWT_SECRET: string;
  JWT_COOKIE_NAME: string;
}

let envVars: EnvVars | undefined;

export class EnvVarError extends Error {
  constructor(varName: string) {
    super(`Failed to find ${varName}; missing .env.local file?`);
  }
}

export default function getEnv(): Readonly<EnvVars> {
  if (envVars) {
    return envVars;
  }

  const DB_URI = process.env.DB_URI;
  if (!DB_URI) {
    throw new EnvVarError("DB_URI");
  }

  const COOKIE_SECRET_RAW = process.env.COOKIE_SECRET;
  if (!COOKIE_SECRET_RAW) {
    throw new EnvVarError("COOKIE_SECRET");
  }
  const COOKIE_SECRET = COOKIE_SECRET_RAW.split("\n");
  if (COOKIE_SECRET.length == 0) {
    throw new EnvVarError("COOKIE_SECRET");
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new EnvVarError("JWT_SECRET");
  }

  const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME;
  if (!JWT_COOKIE_NAME) {
    throw new EnvVarError("JWT_COOKIE_NAME");
  }

  envVars = { DB_URI, COOKIE_SECRET, JWT_SECRET, JWT_COOKIE_NAME };
  Object.freeze(envVars);
  return envVars;
}
