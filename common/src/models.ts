export type Province = "AB" | "BC" | "MB" | "NB" | "NL" | "NS" | "ON" | "PE" | "QC" | "SK";
export const provinces: ReadonlyArray<Province> =
  ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK"];

export interface Address {
  street?: string;
  city?: string;
  province?: Province;
  postalCode?: string;
}

export interface StudentDataSmall {
  idNumber: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface StudentData extends StudentDataSmall {
  password?: string;
  address: Address;
  phone?: string;
  program?: string;
  courses?: string[];
}

export interface CourseData {
  code: string;
  name: string;
  section: number;
  semester: string;
}
