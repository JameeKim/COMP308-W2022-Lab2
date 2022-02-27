import { Province, StudentData, provinces } from "./models";

export const isString = (input: unknown): input is string => typeof input === "string";

export const isStringNull = (input: unknown): input is string | null => {
  return typeof input === "string" || input === null;
};

export const isStringUndefined = (input: unknown): input is string | undefined => {
  return typeof input === "string" || input === undefined;
};

export const isProvince = (input: unknown): input is Province => {
  return typeof input === "string" && provinces.indexOf(input as Province) > -1;
};

export const isStudentData = (input: unknown): input is StudentData => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const inputAny = input as any;
  const res = input
    && isString(inputAny.idNumber)
    && isString(inputAny.email)
    && isStringUndefined(inputAny.password)
    && isString(inputAny.firstName)
    && isString(inputAny.lastName)
    && isStringUndefined(inputAny.phone)
    && isStringUndefined(inputAny.program)
    && inputAny.address
    && isStringUndefined(inputAny.address.street)
    && isStringUndefined(inputAny.address.city)
    && isStringUndefined(inputAny.address.postalCode)
    && (isProvince(inputAny.address.province) || inputAny.address.province === undefined);
  return !!res;
  /* eslint-enable @typescript-eslint/no-explicit-any */
};
