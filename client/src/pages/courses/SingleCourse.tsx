import { useQuery } from "@apollo/client";
import { Outlet, useOutletContext, useParams } from "react-router-dom";

import { gql } from "src/graphql";
import type { CourseByIdQuery } from "src/graphql/graphql";

interface CourseContext {
  id: string;
  loading: boolean;
  error: string | undefined;
  refetch: () => void;
  data: CourseByIdQuery["course"];
}

export const useCourseContext = (): CourseContext => {
  return useOutletContext();
};

export const COURSE_BY_ID = gql(/* GraphQL */`
  query CourseById($id: ID!) {
    course(id: $id) {
      ...Course
    }
  }
`);

/**
 * Parent component (through the routes) for all routes starting with `/courses/:id`
 */
export default function SingleCourse(): JSX.Element {
  const { id = "" } = useParams();
  const { loading, error, data, refetch } = useQuery(COURSE_BY_ID, { variables: { id } });

  const context: CourseContext = {
    id,
    loading,
    error: error?.message,
    refetch: () => { refetch(); },
    data: data?.course,
  };

  return <Outlet context={context} />;
}
