import mongoose from "mongoose";

import type { StudentData, StudentDataSmall } from "@dohyunkim/common";

type StudentDataServerBase = Omit<StudentData, "courses" | "_id">;

export interface StudentDataServer extends StudentDataServerBase {
  password: string;
  createdAt: Date,
  updatedAt: Date,
  courses: mongoose.Types.ObjectId[],
}

const schema = new mongoose.Schema<StudentDataServer>(
  {
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      province: {
        type: String,
        enum: ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK"],
        required: true,
      },
      postalCode: {
        type: String,
        match: /^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/,
        // required: true,
      },
    },
    phone: {
      type: String,
      // required: true,
    },
    program: {
      type: String,
      // required: true,
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
  },
  {
    timestamps: true,
  },
);

const Student = mongoose.model("Student", schema);
export default Student;

export type StudentDoc = mongoose.HydratedDocument<StudentDataServer>;

export function toClientData(
  serverData: StudentDoc,
  detailed: false,
): StudentDataSmall;
export function toClientData(
  serverData: StudentDoc,
  detailed: true,
): StudentData;
export function toClientData(
  serverData: StudentDoc,
  detailed = false,
): StudentData | StudentDataSmall {
  const obj = serverData.toJSON();
  const { idNumber, email, firstName, lastName, program, phone, address } = obj;
  const _id = serverData._id.toString();

  if (!detailed) {
    return { _id, idNumber, email, firstName, lastName };
  }

  const courses = obj.courses.map((id) => id.toString());
  return { _id, idNumber, email, firstName, lastName, program, phone, address, courses };
}
