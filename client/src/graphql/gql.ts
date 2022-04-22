/* eslint-disable */
import * as graphql from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation LogOut {\n    logout\n  }\n": graphql.LogOutDocument,
    "\n  query WhoAmI {\n    whoami {\n      ...StudentSelf\n    }\n  }\n": graphql.WhoAmIDocument,
    "\n  fragment Address on Address {\n    street\n    city\n    province\n    postalCode\n  }\n": graphql.AddressFragmentDoc,
    "\n  fragment Model on Model {\n    _id\n  }\n": graphql.ModelFragmentDoc,
    "\n  fragment StudentOther on Student {\n    _id\n    idNumber\n    email\n    firstName\n    lastName\n  }\n": graphql.StudentOtherFragmentDoc,
    "\n  fragment StudentSelf on Student {\n    ...StudentOther\n    address {\n      ...Address\n    }\n    phone\n    program\n    courses {\n      ...Model\n    }\n  }\n": graphql.StudentSelfFragmentDoc,
    "\n  fragment Course on Course {\n    _id\n    code\n    name\n    section\n    semester\n  }\n": graphql.CourseFragmentDoc,
    "\n  mutation UpdateUser($data: StudentInput!) {\n    updateUserInfo(data: $data) {\n      _id\n    }\n  }\n": graphql.UpdateUserDocument,
    "\n  mutation Register($password: String!, $data: StudentInput!) {\n    register(data: $data, password: $password) {\n      _id\n    }\n  }\n": graphql.RegisterDocument,
    "\n  mutation LogIn($id: String!, $password: String!) {\n    login(id: $id, password: $password) {\n      _id\n    }\n  }\n": graphql.LogInDocument,
    "\n  mutation AddCourse($data: CourseInput!) {\n    addCourse(data: $data) {\n      _id\n    }\n  }\n": graphql.AddCourseDocument,
    "\n  query CourseAll {\n    courses {\n      ...Course\n    }\n  }\n": graphql.CourseAllDocument,
    "\n  query StudentsInCourse {\n    students {\n      ...StudentOther\n    }\n  }\n": graphql.StudentsInCourseDocument,
    "\n  mutation UpdateCourse($id: ID!, $data: CourseInput!) {\n    updateCourse(id: $id, data: $data) {\n      _id\n    }\n  }\n": graphql.UpdateCourseDocument,
    "\n  query MyCourses {\n    whoami {\n      _id\n      courses {\n        ...Course\n      }\n    }\n  }\n": graphql.MyCoursesDocument,
    "\n  query CourseById($id: ID!) {\n    course(id: $id) {\n      ...Course\n    }\n  }\n": graphql.CourseByIdDocument,
    "\n  query StudentById($id: ID!) {\n    student(id: $id) {\n      ...StudentOther\n      courses {\n        ...Course\n      }\n    }\n  }\n": graphql.StudentByIdDocument,
    "\n  query StudentsAll {\n    students {\n      ...StudentOther\n    }\n  }\n": graphql.StudentsAllDocument,
};

export function gql(source: "\n  mutation LogOut {\n    logout\n  }\n"): (typeof documents)["\n  mutation LogOut {\n    logout\n  }\n"];
export function gql(source: "\n  query WhoAmI {\n    whoami {\n      ...StudentSelf\n    }\n  }\n"): (typeof documents)["\n  query WhoAmI {\n    whoami {\n      ...StudentSelf\n    }\n  }\n"];
export function gql(source: "\n  fragment Address on Address {\n    street\n    city\n    province\n    postalCode\n  }\n"): (typeof documents)["\n  fragment Address on Address {\n    street\n    city\n    province\n    postalCode\n  }\n"];
export function gql(source: "\n  fragment Model on Model {\n    _id\n  }\n"): (typeof documents)["\n  fragment Model on Model {\n    _id\n  }\n"];
export function gql(source: "\n  fragment StudentOther on Student {\n    _id\n    idNumber\n    email\n    firstName\n    lastName\n  }\n"): (typeof documents)["\n  fragment StudentOther on Student {\n    _id\n    idNumber\n    email\n    firstName\n    lastName\n  }\n"];
export function gql(source: "\n  fragment StudentSelf on Student {\n    ...StudentOther\n    address {\n      ...Address\n    }\n    phone\n    program\n    courses {\n      ...Model\n    }\n  }\n"): (typeof documents)["\n  fragment StudentSelf on Student {\n    ...StudentOther\n    address {\n      ...Address\n    }\n    phone\n    program\n    courses {\n      ...Model\n    }\n  }\n"];
export function gql(source: "\n  fragment Course on Course {\n    _id\n    code\n    name\n    section\n    semester\n  }\n"): (typeof documents)["\n  fragment Course on Course {\n    _id\n    code\n    name\n    section\n    semester\n  }\n"];
export function gql(source: "\n  mutation UpdateUser($data: StudentInput!) {\n    updateUserInfo(data: $data) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($data: StudentInput!) {\n    updateUserInfo(data: $data) {\n      _id\n    }\n  }\n"];
export function gql(source: "\n  mutation Register($password: String!, $data: StudentInput!) {\n    register(data: $data, password: $password) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation Register($password: String!, $data: StudentInput!) {\n    register(data: $data, password: $password) {\n      _id\n    }\n  }\n"];
export function gql(source: "\n  mutation LogIn($id: String!, $password: String!) {\n    login(id: $id, password: $password) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation LogIn($id: String!, $password: String!) {\n    login(id: $id, password: $password) {\n      _id\n    }\n  }\n"];
export function gql(source: "\n  mutation AddCourse($data: CourseInput!) {\n    addCourse(data: $data) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation AddCourse($data: CourseInput!) {\n    addCourse(data: $data) {\n      _id\n    }\n  }\n"];
export function gql(source: "\n  query CourseAll {\n    courses {\n      ...Course\n    }\n  }\n"): (typeof documents)["\n  query CourseAll {\n    courses {\n      ...Course\n    }\n  }\n"];
export function gql(source: "\n  query StudentsInCourse {\n    students {\n      ...StudentOther\n    }\n  }\n"): (typeof documents)["\n  query StudentsInCourse {\n    students {\n      ...StudentOther\n    }\n  }\n"];
export function gql(source: "\n  mutation UpdateCourse($id: ID!, $data: CourseInput!) {\n    updateCourse(id: $id, data: $data) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCourse($id: ID!, $data: CourseInput!) {\n    updateCourse(id: $id, data: $data) {\n      _id\n    }\n  }\n"];
export function gql(source: "\n  query MyCourses {\n    whoami {\n      _id\n      courses {\n        ...Course\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyCourses {\n    whoami {\n      _id\n      courses {\n        ...Course\n      }\n    }\n  }\n"];
export function gql(source: "\n  query CourseById($id: ID!) {\n    course(id: $id) {\n      ...Course\n    }\n  }\n"): (typeof documents)["\n  query CourseById($id: ID!) {\n    course(id: $id) {\n      ...Course\n    }\n  }\n"];
export function gql(source: "\n  query StudentById($id: ID!) {\n    student(id: $id) {\n      ...StudentOther\n      courses {\n        ...Course\n      }\n    }\n  }\n"): (typeof documents)["\n  query StudentById($id: ID!) {\n    student(id: $id) {\n      ...StudentOther\n      courses {\n        ...Course\n      }\n    }\n  }\n"];
export function gql(source: "\n  query StudentsAll {\n    students {\n      ...StudentOther\n    }\n  }\n"): (typeof documents)["\n  query StudentsAll {\n    students {\n      ...StudentOther\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;