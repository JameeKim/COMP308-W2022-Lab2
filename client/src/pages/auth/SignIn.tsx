import { useMutation } from "@apollo/client";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { isString } from "@dohyunkim/common";
import Label from "src/components/form/Label";
import PasswordInput from "src/components/form/PasswordInput";
import { gql } from "src/graphql";

const LOG_IN = gql(/* GraphQL */`
  mutation LogIn($id: String!, $password: String!) {
    login(id: $id, password: $password) {
      _id
    }
  }
`);

export default function SignIn(): JSX.Element | null {
  const [loginMutation, { loading, error }] = useMutation(LOG_IN, {
    refetchQueries: ["WhoAmI"],
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const id = formData.get("id") || undefined;
    const password = formData.get("password") || undefined;

    if (!isString(id) || !isString(password)) return;

    try {
      await loginMutation({ variables: { id, password } });
    } catch { /* do nothing */ }
  };

  return (
    <main className="card border-info">
      <div className="card-body px-5">
        <h1 className="card-title mb-3">Sign In</h1>
        {error && (
          <p className="alert alert-danger" role="alert">{error.message}</p>
        )}
        <form
          action="/api/auth/login"
          method="post"
          className="container container-sm-max"
          onSubmit={onSubmit}
        >
          <div className="mb-3">
            <Label htmlFor="signin-id" className="form-label" required>Student ID</Label>
            <input
              type="text"
              name="id"
              id="signin-id"
              className="form-control"
              required
              pattern="[0-9]{9}"
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="signin-pw" className="form-label" required>Password</Label>
            <PasswordInput
              name="password"
              id="signin-pw"
              className="form-control"
              required
              disabled={loading}
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-3 text-center">
          Don&apos;t have an account?{" "}
          <Link to="../register">Register here</Link>
        </p>
      </div>
    </main>
  );
}
