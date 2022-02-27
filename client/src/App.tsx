import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/auth";
import Layout from "./Layout";
import Account from "./pages/auth/Account";
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import "bootstrap/dist/css/bootstrap.min.css";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="auth">
            <Route path="sign-in" element={<SignIn />} />
            <Route path="register" element={<Register />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
