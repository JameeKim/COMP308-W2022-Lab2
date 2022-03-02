import { CourseData, Province, StudentData, provinces } from "./models";

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

export const isNumber = (input: unknown): input is number => typeof input === "number";

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

type CourseSectionLike = number | string;

export const isCourseSectionLike = (input: unknown): input is CourseSectionLike => {
  if (isNumber(input)) {
    return input > 0 && input < 1000;
  }
  if (isString(input)) {
    const num = parseInt(input);
    return !isNaN(num) && num > 0 && num < 1000;
  }
  return false;
};

export const courseSectionToNumber = (input: unknown, bypassCheck = false): number => {
  if (!bypassCheck && !isCourseSectionLike(input)) {
    throw new Error(`Failed to parse course section from ${input}`);
  }
  return isNumber(input) ? input : parseInt(input as string);
};

export const sectionToString = (section: number): string => {
  if (section < 10) return `00${section}`;
  if (section < 100) return `0${section}`;
  return section.toString();
};

export const isCourseData = (input: unknown): input is CourseData => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const inputAny = input as any;
  const res = input
    && isString(inputAny.code)
    && isString(inputAny.name)
    && isCourseSectionLike(inputAny.section)
    && isString(inputAny.semester);
  return !!res;
  /* eslint-enable @typescript-eslint/no-explicit-any */
};
