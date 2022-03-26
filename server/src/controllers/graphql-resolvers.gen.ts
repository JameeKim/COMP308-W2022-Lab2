import type { Province } from '@dohyunkim/common';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { StudentDoc } from '../models/student';
import type { CourseDoc } from '../models/course';
import type { ExpressContext } from 'apollo-server-express';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  AddressInput: AddressInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Course: ResolverTypeWrapper<CourseDoc>;
  CourseInput: CourseInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Model: ResolversTypes['Course'] | ResolversTypes['Student'];
  Mutation: ResolverTypeWrapper<{}>;
  Province: Province;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Student: ResolverTypeWrapper<StudentDoc>;
  StudentInput: StudentInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  AddressInput: AddressInput;
  Boolean: Scalars['Boolean'];
  Course: CourseDoc;
  CourseInput: CourseInput;
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Model: ResolversParentTypes['Course'] | ResolversParentTypes['Student'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  Student: StudentDoc;
  StudentInput: StudentInput;
};

export type AddressResolvers<ContextType = ExpressContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['Province']>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseResolvers<ContextType = ExpressContext, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  section?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  semester?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  students?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ModelResolvers<ContextType = ExpressContext, ParentType extends ResolversParentTypes['Model'] = ResolversParentTypes['Model']> = {
  __resolveType: TypeResolveFn<'Course' | 'Student', ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = ExpressContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCourse?: Resolver<Maybe<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationAddCourseArgs, 'data'>>;
  dropCourse?: Resolver<Maybe<Array<ResolversTypes['Course']>>, ParentType, ContextType, RequireFields<MutationDropCourseArgs, 'courseId'>>;
  enrolCourse?: Resolver<Maybe<Array<ResolversTypes['Course']>>, ParentType, ContextType, RequireFields<MutationEnrolCourseArgs, 'courseId'>>;
  login?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'id' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  register?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'data' | 'password'>>;
  updateCourse?: Resolver<Maybe<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationUpdateCourseArgs, 'data' | 'id'>>;
  updateUserInfo?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<MutationUpdateUserInfoArgs, 'data'>>;
};

export type ProvinceResolvers = EnumResolverSignature<{ AB?: any, BC?: any, MB?: any, NB?: any, NL?: any, NS?: any, ON?: any, PE?: any, QC?: any, SK?: any }, ResolversTypes['Province']>;

export type QueryResolvers<ContextType = ExpressContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  course?: Resolver<Maybe<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<QueryCourseArgs, 'id'>>;
  courses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<QueryStudentArgs, 'id'>>;
  students?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>;
  whoami?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType>;
};

export type StudentResolvers<ContextType = ExpressContext, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  courses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  idNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  program?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ExpressContext> = {
  Address?: AddressResolvers<ContextType>;
  Course?: CourseResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Model?: ModelResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Province?: ProvinceResolvers;
  Query?: QueryResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
};

