import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import type { StudentData } from "@dohyunkim/common";
import UserInfoForm from "src/components/UserInfoForm";
import { useAuth } from "src/contexts/auth";
import { gql } from "src/graphql";

const UPDATE_USER = gql(/* GraphQL */`
  mutation UpdateUser($data: StudentInput!) {
    updateUserInfo(data: $data) {
      _id
    }
  }
`);

export default function Account(): JSX.Element {
  const { user } = useAuth();
  const [updateMutation, { loading, error }] = useMutation(UPDATE_USER, {
    refetchQueries: ["WhoAmI"],
  });
  const navigate = useNavigate();

  const onSubmit = async (data?: StudentData): Promise<void> => {
    if (!data) return;
    try {
      await updateMutation({ variables: { data } });
      navigate(`/students/${user?._id ?? ""}`);
    } catch { /* do nothing */ }
  };

  return (
    <main className="card">
      <div className="card-body px-5">
        <h1 className="card-title mb-3">Account Information</h1>
      </div>
      <UserInfoForm
        action="/api/auth/change"
        method="post"
        className="list-group list-group-flush"
        id="user-info"
        user={user}
        disabled={loading}
        onSubmit={onSubmit}
      />
      <div className="card-body text-center">
        {error && (
          <p className="alert alert-danger" role="alert">{error.message}</p>
        )}
        <button type="submit" form="user-info" className="btn btn-primary" disabled={loading}>
          Update
        </button>
      </div>
    </main>
  );
}
