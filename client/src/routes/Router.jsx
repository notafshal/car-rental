import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Homepage from "../pages/Homepage";
import Collections from "../pages/Collections";

const Routers = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/Login" element={<Login />} exact />
          <Route path="/Register" element={<Register />} exact />
          <Route path="/collections" element={<Collections />} exact />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Routers;
