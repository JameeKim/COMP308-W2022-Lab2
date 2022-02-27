import mongoose from "mongoose";

import type { StudentData } from "@dohyunkim/common";

export interface StudentDataServer extends StudentData {
  password: string;
  createdAt: Date,
  updatedAt: Date,
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
  },
  {
    timestamps: true,
  },
);

const Student = mongoose.model("Student", schema);
export default Student;

export type StudentDoc = mongoose.HydratedDocument<StudentDataServer>;

export const toClientData = (serverData: StudentDataServer | StudentDoc): StudentData => {
  const obj = serverData instanceof Student ? serverData.toJSON() : serverData;
  const { idNumber, email, firstName, lastName, program, phone, address } = obj;
  return { idNumber, email, firstName, lastName, program, phone, address };
};
