import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import "bootstrap/dist/css/bootstrap.min.css";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
