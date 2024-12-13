import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Routers from "../../routes/Router";

jest.mock("../../pages/Homepage", () => () => <div>Homepage Component</div>);
jest.mock("../../pages/Login", () => () => <div>Login Component</div>);
jest.mock("../../pages/Register", () => () => <div>Register Component</div>);
jest.mock("../../pages/Collections", () => () => (
  <div>Collections Component</div>
));
jest.mock("../../pages/CarPage", () => () => <div>CarPage Component</div>);
jest.mock("../../pages/BookPage", () => () => <div>BookPage Component</div>);
jest.mock("../../pages/Profile", () => () => <div>Profile Component</div>);
jest.mock("../../pages/EditProfile", () => () => (
  <div>EditProfile Component</div>
));
jest.mock("../../pages/ViewBookings", () => () => (
  <div>ViewBookings Component</div>
));
jest.mock("../../pages/Dashboard", () => () => <div>Dashboard Component</div>);
jest.mock("../../pages/FilteredResults", () => () => (
  <div>FilteredResults Component</div>
));

describe("Routers Component", () => {
  it("renders the Homepage component for the root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routers />
      </MemoryRouter>
    );
    expect(screen.getByText("Homepage Component")).toBeInTheDocument();
  });

  it("renders the Login component for the /Login route", () => {
    render(
      <MemoryRouter initialEntries={["/Login"]}>
        <Routers />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Component")).toBeInTheDocument();
  });

  it("renders the Register component for the /Register route", () => {
    render(
      <MemoryRouter initialEntries={["/Register"]}>
        <Routers />
      </MemoryRouter>
    );
    expect(screen.getByText("Register Component")).toBeInTheDocument();
  });

  it("renders the BookPage component for the /bookpage/:id route", () => {
    render(
      <MemoryRouter initialEntries={["/bookpage/1"]}>
        <Routers />
      </MemoryRouter>
    );
    expect(screen.getByText("BookPage Component")).toBeInTheDocument();
  });

  it("renders the CarPage component for the /cars/:id route", () => {
    render(
      <MemoryRouter initialEntries={["/cars/1"]}>
        <Routers />
      </MemoryRouter>
    );
    expect(screen.getByText("CarPage Component")).toBeInTheDocument();
  });
});
