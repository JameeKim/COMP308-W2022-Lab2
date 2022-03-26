import mongoose from "mongoose";

import {
  Province,
  StudentData, StudentDataFromServer, StudentDataSmallFromServer,
} from "@dohyunkim/common";

export interface StudentDataServer extends Omit<StudentData, "_id"> {
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
        enum: Object.keys(Province),
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
): StudentDataSmallFromServer;
export function toClientData(
  serverData: StudentDoc,
  detailed: true,
): StudentDataFromServer;
export function toClientData(
  serverData: StudentDoc,
  detailed = false,
): StudentDataFromServer | StudentDataSmallFromServer {
  const obj = serverData.toJSON();
  const { idNumber, email, firstName, lastName, program, phone, address } = obj;
  const _id = serverData._id.toString();

  if (!detailed) {
    return { _id, idNumber, email, firstName, lastName };
  }

  const courses = obj.courses.map((id) => id.toString());
  return { _id, idNumber, email, firstName, lastName, program, phone, address, courses };
}
