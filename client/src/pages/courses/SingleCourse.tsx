import { Outlet, useOutletContext, useParams } from "react-router-dom";

import type { CourseDataFromServer } from "@dohyunkim/common";
import useFetchData, { FetchData } from "src/hooks/useFetchData";

interface CourseContext extends FetchData<CourseDataFromServer> {
  id: string;
}

export const useCourseContext = (): CourseContext => {
  return useOutletContext();
};

/**
 * Parent component (through the routes) for all routes starting with `/courses/:id`
 */
export default function SingleCourse(): JSX.Element {
  const { id = "" } = useParams();
  const url = `/api/courses/${id}`;
  const context = useFetchData<CourseDataFromServer>(url);

  return <Outlet context={{ ...context, id }} />;
}
