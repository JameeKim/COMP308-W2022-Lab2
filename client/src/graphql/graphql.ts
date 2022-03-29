/* eslint-disable */
import type { Province } from '@dohyunkim/common';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type Address = {
  __typename: 'Address';
  city?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  street?: Maybe<Scalars['String']>;
};

/** Input data for address */
export type AddressInput = {
  city?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Province>;
  street?: InputMaybe<Scalars['String']>;
};

export type Course = Model & {
  __typename: 'Course';
  _id: Scalars['ID'];
  code: Scalars['String'];
  name: Scalars['String'];
  section: Scalars['Int'];
  semester: Scalars['String'];
  students: Array<Student>;
};

/** Input data for a course */
export type CourseInput = {
  code: Scalars['String'];
  name: Scalars['String'];
  section: Scalars['Int'];
  semester: Scalars['String'];
};

export type Model = {
  _id: Scalars['ID'];
};

export type Mutation = {
  __typename: 'Mutation';
  addCourse?: Maybe<Course>;
  dropCourse?: Maybe<Array<Course>>;
  enrolCourse?: Maybe<Array<Course>>;
  login?: Maybe<Student>;
  logout?: Maybe<Scalars['Boolean']>;
  register?: Maybe<Student>;
  updateCourse?: Maybe<Course>;
  updateUserInfo?: Maybe<Student>;
};


export type MutationAddCourseArgs = {
  data: CourseInput;
};


export type MutationDropCourseArgs = {
  courseId: Scalars['ID'];
};


export type MutationEnrolCourseArgs = {
  courseId: Scalars['ID'];
};


export type MutationLoginArgs = {
  id: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  data: StudentInput;
  password: Scalars['String'];
};


export type MutationUpdateCourseArgs = {
  data: CourseInput;
  id: Scalars['ID'];
};


export type MutationUpdateUserInfoArgs = {
  data: StudentInput;
};

export { Province };

export type Query = {
  __typename: 'Query';
  course?: Maybe<Course>;
  courses: Array<Course>;
  student?: Maybe<Student>;
  students: Array<Student>;
  whoami?: Maybe<Student>;
};


export type QueryCourseArgs = {
  id: Scalars['ID'];
};


export type QueryStudentArgs = {
  id: Scalars['ID'];
};

export type Student = Model & {
  __typename: 'Student';
  _id: Scalars['ID'];
  address: Address;
  courses: Array<Course>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  idNumber: Scalars['String'];
  lastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  program?: Maybe<Scalars['String']>;
};

/** Input data for registering a new student */
export type StudentInput = {
  address?: InputMaybe<AddressInput>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  idNumber: Scalars['String'];
  lastName: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  program?: InputMaybe<Scalars['String']>;
};

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename: 'Mutation', logout?: boolean | null };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename: 'Query', whoami?: { __typename: 'Student', phone?: string | null, program?: string | null, _id: string, idNumber: string, email: string, firstName: string, lastName: string, address: { __typename: 'Address', street?: string | null, city?: string | null, province?: Province | null, postalCode?: string | null }, courses: Array<{ __typename: 'Course', _id: string }> } | null };

export type AddressFragment = { __typename: 'Address', street?: string | null, city?: string | null, province?: Province | null, postalCode?: string | null };

type Model_Course_Fragment = { __typename: 'Course', _id: string };

type Model_Student_Fragment = { __typename: 'Student', _id: string };

export type ModelFragment = Model_Course_Fragment | Model_Student_Fragment;

export type StudentOtherFragment = { __typename: 'Student', _id: string, idNumber: string, email: string, firstName: string, lastName: string };

export type StudentSelfFragment = { __typename: 'Student', phone?: string | null, program?: string | null, _id: string, idNumber: string, email: string, firstName: string, lastName: string, address: { __typename: 'Address', street?: string | null, city?: string | null, province?: Province | null, postalCode?: string | null }, courses: Array<{ __typename: 'Course', _id: string }> };

export type CourseFragment = { __typename: 'Course', _id: string, code: string, name: string, section: number, semester: string };

export type UpdateUserMutationVariables = Exact<{
  data: StudentInput;
}>;


export type UpdateUserMutation = { __typename: 'Mutation', updateUserInfo?: { __typename: 'Student', _id: string } | null };

export type RegisterMutationVariables = Exact<{
  password: Scalars['String'];
  data: StudentInput;
}>;


export type RegisterMutation = { __typename: 'Mutation', register?: { __typename: 'Student', _id: string } | null };

export type LogInMutationVariables = Exact<{
  id: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInMutation = { __typename: 'Mutation', login?: { __typename: 'Student', _id: string } | null };

export type AddCourseMutationVariables = Exact<{
  data: CourseInput;
}>;


export type AddCourseMutation = { __typename: 'Mutation', addCourse?: { __typename: 'Course', _id: string } | null };

export type CourseAllQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseAllQuery = { __typename: 'Query', courses: Array<{ __typename: 'Course', _id: string, code: string, name: string, section: number, semester: string }> };

export type StudentsInCourseQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentsInCourseQuery = { __typename: 'Query', students: Array<{ __typename: 'Student', _id: string, idNumber: string, email: string, firstName: string, lastName: string }> };

export type UpdateCourseMutationVariables = Exact<{
  id: Scalars['ID'];
  data: CourseInput;
}>;


export type UpdateCourseMutation = { __typename: 'Mutation', updateCourse?: { __typename: 'Course', _id: string } | null };

export type CourseByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CourseByIdQuery = { __typename: 'Query', course?: { __typename: 'Course', _id: string, code: string, name: string, section: number, semester: string } | null };

export type StudentByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StudentByIdQuery = { __typename: 'Query', student?: { __typename: 'Student', _id: string, idNumber: string, email: string, firstName: string, lastName: string, courses: Array<{ __typename: 'Course', _id: string, code: string, name: string, section: number, semester: string }> } | null };

export type StudentsAllQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentsAllQuery = { __typename: 'Query', students: Array<{ __typename: 'Student', _id: string, idNumber: string, email: string, firstName: string, lastName: string }> };

export const StudentOtherFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentOther"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Student"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"idNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]} as unknown as DocumentNode<StudentOtherFragment, unknown>;
export const AddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}}]}}]} as unknown as DocumentNode<AddressFragment, unknown>;
export const ModelFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Model"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Model"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]} as unknown as DocumentNode<ModelFragment, unknown>;
export const StudentSelfFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentSelf"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Student"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentOther"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"program"}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Model"}}]}}]}},...StudentOtherFragmentDoc.definitions,...AddressFragmentDoc.definitions,...ModelFragmentDoc.definitions]} as unknown as DocumentNode<StudentSelfFragment, unknown>;
export const CourseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Course"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"semester"}}]}}]} as unknown as DocumentNode<CourseFragment, unknown>;
export const LogOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;
export const WhoAmIDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WhoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentSelf"}}]}}]}},...StudentSelfFragmentDoc.definitions]} as unknown as DocumentNode<WhoAmIQuery, WhoAmIQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const LogInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<LogInMutation, LogInMutationVariables>;
export const AddCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<AddCourseMutation, AddCourseMutationVariables>;
export const CourseAllDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Course"}}]}}]}},...CourseFragmentDoc.definitions]} as unknown as DocumentNode<CourseAllQuery, CourseAllQueryVariables>;
export const StudentsInCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentsInCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentOther"}}]}}]}},...StudentOtherFragmentDoc.definitions]} as unknown as DocumentNode<StudentsInCourseQuery, StudentsInCourseQueryVariables>;
export const UpdateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpdateCourseMutation, UpdateCourseMutationVariables>;
export const CourseByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Course"}}]}}]}},...CourseFragmentDoc.definitions]} as unknown as DocumentNode<CourseByIdQuery, CourseByIdQueryVariables>;
export const StudentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentOther"}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Course"}}]}}]}}]}},...StudentOtherFragmentDoc.definitions,...CourseFragmentDoc.definitions]} as unknown as DocumentNode<StudentByIdQuery, StudentByIdQueryVariables>;
export const StudentsAllDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentsAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentOther"}}]}}]}},...StudentOtherFragmentDoc.definitions]} as unknown as DocumentNode<StudentsAllQuery, StudentsAllQueryVariables>;