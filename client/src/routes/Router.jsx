import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

const Routers = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} exact />
          <Route path="/Register" element={<Register />} exact />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Routers;
