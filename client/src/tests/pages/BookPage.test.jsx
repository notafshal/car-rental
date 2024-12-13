import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookPage from "../../pages/BookPage";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

describe("BookPage Component", () => {
  const mockUser = { id: 1, name: "Test User" };

  const renderComponent = (user = null) => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user }}>
          <BookPage />
        </UserContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders booking form if user is logged in", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } }); // Mock Navbar API call
    renderComponent(mockUser);

    expect(screen.getByText(/Book a Car/i)).toBeInTheDocument();
  });

  it("updates duration type and value on user input", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    renderComponent(mockUser);

    const durationTypeSelect = screen.getByLabelText(/Booking Type/i);
    fireEvent.change(durationTypeSelect, { target: { value: "day" } });

    const durationValueInput = screen.getByLabelText(/Number of days/i);
    fireEvent.change(durationValueInput, { target: { value: 3 } });

    expect(durationTypeSelect.value).toBe("day");
    expect(durationValueInput.value).toBe("3");
  });

  it("displays start and end date inputs for 'day' or 'week' duration types", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    renderComponent(mockUser);

    const durationTypeSelect = screen.getByLabelText(/Booking Type/i);
    fireEvent.change(durationTypeSelect, { target: { value: "day" } });

    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it("submits booking data successfully", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    axios.post.mockResolvedValueOnce({ data: { message: "Success" } });
    renderComponent(mockUser);

    fireEvent.change(screen.getByLabelText(/Booking Type/i), {
      target: { value: "day" },
    });
    fireEvent.change(screen.getByLabelText(/Number of days/i), {
      target: { value: 2 },
    });
    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: "2024-12-15" },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: "2024-12-17" },
    });

    fireEvent.click(screen.getByText(/Book Car/i));

    await waitFor(() => {
      expect(screen.getByText(/Car booked successfully!/i)).toBeInTheDocument();
    });
  });

  it("shows error message if booking fails", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Failed to book" } },
    });
    renderComponent(mockUser);

    fireEvent.change(screen.getByLabelText(/Booking Type/i), {
      target: { value: "hour" },
    });
    fireEvent.change(screen.getByLabelText(/Number of hours/i), {
      target: { value: 1 },
    });

    fireEvent.click(screen.getByText(/Book Car/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to book/i)).toBeInTheDocument();
    });
  });
});
