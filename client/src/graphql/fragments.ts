import { gql } from ".";

export const ADDRESS_FRAGMENT = gql(/* GraphQL */`
  fragment Address on Address {
    street
    city
    province
    postalCode
  }
`);

export const MODEL_FRAGMENT = gql(/* GraphQL */`
  fragment Model on Model {
    _id
  }
`);

export const STUDENT_OTHER = gql(/* GraphQL */`
  fragment StudentOther on Student {
    _id
    idNumber
    email
    firstName
    lastName
  }
`);

export const STUDENT_SELF = gql(/* GraphQL */`
  fragment StudentSelf on Student {
    ...StudentOther
    address {
      ...Address
    }
    phone
    program
    courses {
      ...Model
    }
  }
`);

export const COURSE_FRAGMENT = gql(/* GraphQL */`
  fragment Course on Course {
    _id
    code
    name
    section
    semester
  }
`);
