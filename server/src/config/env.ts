export interface EnvVars {
  DB_URI: string,
  COOKIE_SECRET: string[];
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

  envVars = { DB_URI, COOKIE_SECRET };
  Object.freeze(envVars);
  return envVars;
}
