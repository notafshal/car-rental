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
import Dashboard from "../pages/Dashboard";
import FilteredResults from "../pages/FilteredResults";

const Routers = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/Login" element={<Login />} exact />
          <Route path="/Register" element={<Register />} exact />
          <Route path="/collections" element={<Collections />} exact />
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/edit-profile" element={<EditProfile />} exact />
          <Route path="/viewbooking" element={<ViewBookings />} exact />
          <Route path="/dashboard" element={<Dashboard />} exact />
          <Route path="/filtered-results" element={<FilteredResults />} />
          <Route path="/cars/:id" element={<CarPage />} />
          <Route path="/bookpage/:id" element={<BookPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Routers;
