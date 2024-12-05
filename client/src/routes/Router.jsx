import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Homepage from "../pages/Homepage";
import Collections from "../pages/Collections";
import CarPage from "../pages/CarPage";
import BookPage from "../pages/BookPage";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ViewBookings from "../pages/ViewBookings";

const Routers = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/Login" element={<Login />} exact />
          <Route path="/Register" element={<Register />} exact />
          <Route path="/collections" element={<Collections />} exact />
          <Route path="/cars/:id" element={<CarPage />} />
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/edit-profile" element={<EditProfile />} exact />
          <Route path="/bookpage/:id" element={<BookPage />} />
          <Route path="/viewbooking" element={<ViewBookings />} exact />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Routers;
