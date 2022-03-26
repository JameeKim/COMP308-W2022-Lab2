export enum Province {
  AB = "AB",
  BC = "BC",
  MB = "MB",
  NB = "NB",
  NL = "NL",
  NS = "NS",
  ON = "ON",
  PE = "PE",
  QC = "QC",
  SK = "SK",
}

export type WithId<T> = T & { _id: string };

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

export type StudentDataSmallFromServer = WithId<StudentDataSmall>;

export interface StudentData extends StudentDataSmall {
  password?: string;
  address: Address;
  phone?: string;
  program?: string;
}

export interface StudentDataFromServer extends WithId<StudentData> {
  courses: string[];
}

export interface CourseData {
  code: string;
  name: string;
  section: number;
  semester: string;
}

export interface CourseDataFromServer extends WithId<CourseData> {
  students?: string[];
}
