export type Province = "AB" | "BC" | "MB" | "NB" | "NL" | "NS" | "ON" | "PE" | "QC" | "SK";
export const provinces: ReadonlyArray<Province> =
  ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK"];

export interface Address {
  street?: string;
  city?: string;
  province?: Province;
  postalCode?: string;
}

export interface StudentData {
  idNumber: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address: Address;
  phone?: string;
  program?: string;
}

export interface Course {
  code: string;
  name: string;
  section: number;
  semester: string;
}
