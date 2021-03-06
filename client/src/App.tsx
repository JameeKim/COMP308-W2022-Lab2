import { Route, Routes } from "react-router-dom";

import { AuthProvider, RequireAuth } from "./contexts/auth";
import { FetchProvider } from "./contexts/fetch";
import Layout from "./Layout";
import Account from "./pages/auth/Account";
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import CourseAdd from "./pages/courses/CourseAdd";
import CourseAll from "./pages/courses/CourseAll";
import CourseDetails from "./pages/courses/CourseDetails";
import CourseEdit from "./pages/courses/CourseEdit";
import Courses from "./pages/courses/Courses";
import SingleCourse from "./pages/courses/SingleCourse";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDetails from "./pages/students/StudentDetails";
import Students from "./pages/students/Students";

import "bootstrap/dist/css/bootstrap.min.css";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <FetchProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />

            <Route path="auth">
              <Route path="sign-in" element={<SignIn />} />
              <Route path="register" element={<Register />} />
              <Route path="account" element={<Account />} />
            </Route>

            <Route path="courses">
              <Route index element={<Courses />} />
              <Route path="all" element={<CourseAll />} />
              <Route path="add" element={<RequireAuth><CourseAdd /></RequireAuth>} />
              <Route path=":id" element={<SingleCourse />}>
                <Route index element={<CourseDetails />} />
                <Route path="edit" element={<RequireAuth><CourseEdit /></RequireAuth>} />
              </Route>
            </Route>

            <Route path="students">
              <Route index element={<RequireAuth><Students /></RequireAuth>} />
              <Route path=":id" element={<RequireAuth><StudentDetails /></RequireAuth>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </FetchProvider>
    </AuthProvider>
  );
}

export default App;
