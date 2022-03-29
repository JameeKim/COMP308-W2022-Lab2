import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import type { StudentData } from "@dohyunkim/common";
import UserInfoForm from "src/components/UserInfoForm";
import { gql } from "src/graphql";

const REGISTER = gql(/* GraphQL */`
  mutation Register($password: String!, $data: StudentInput!) {
    register(data: $data, password: $password) {
      _id
    }
  }
`);

export default function Register(): JSX.Element {
  const [registerMutation, { loading, error }] = useMutation(REGISTER, {
    refetchQueries: ["WhoAmI"],
  });

  const onSubmit = async (input?: StudentData): Promise<void> => {
    if (!input) return;
    if (!input.password) return;
    const { password, ...data } = input;
    try {
      await registerMutation({
        variables: { data, password },
      });
    } catch { /* do nothing */ }
  };

  return (
    <main className="card border-info">
      <div className="card-body px-5">
        <h1 className="card-title mb-3">Register For an Account</h1>
        <p className="card-text">
          Already have an account?{" "}
          <Link to="../sign-in">Sign in here</Link>
        </p>
      </div>
      <UserInfoForm
        action="/api/auth/register"
        method="post"
        className="list-group list-group-flush"
        id="user-register"
        disabled={loading}
        onSubmit={onSubmit}
      />
      <div className="card-body text-center">
        {error && (
          <p className="alert alert-danger" role="alert">{error.message}</p>
        )}
        <button type="submit" form="user-register" className="btn btn-primary" disabled={loading}>
          Register
        </button>
      </div>
    </main>
  );
}
