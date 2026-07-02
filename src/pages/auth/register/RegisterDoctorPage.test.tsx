import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterDoctorPage from "./RegisterDoctorPage";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const post = axios.post as unknown as ReturnType<typeof vi.fn>;
const isAxiosError = axios.isAxiosError as unknown as ReturnType<typeof vi.fn>;

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterDoctorPage />
    </MemoryRouter>,
  );
}

async function fillStep1() {
  await userEvent.type(screen.getByLabelText(/full name/i), "Dr Strange");
  await userEvent.type(
    screen.getByLabelText(/email address/i),
    "doc@example.com",
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), "StrongPass1!");
  await userEvent.type(
    screen.getByLabelText(/confirm password/i),
    "StrongPass1!",
  );
  await userEvent.selectOptions(screen.getByRole("combobox"), "Cardiology");
  await userEvent.type(
    screen.getByLabelText(/veterinary clinic name/i),
    "Pet Care Plus",
  );
  await userEvent.type(
    screen.getByLabelText(/clinic address/i),
    "1 Pet Street",
  );
}

async function fillStep2Prices() {
  const inputs = screen
    .getAllByRole("spinbutton")
    .filter((el) => el instanceof HTMLInputElement) as HTMLInputElement[];
  for (const input of inputs) {
    await userEvent.type(input, "50");
  }
}

describe("RegisterDoctorPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    post.mockReset();
    isAxiosError.mockReset();
  });

  it("renders step 1 by default", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /personal & professional details/i,
      }),
    ).toBeInTheDocument();
  });

  it("blocks transition to step 2 when step 1 is invalid", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /personal & professional details/i,
        }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("heading", { name: /services & pricing/i }),
    ).not.toBeInTheDocument();
  });

  it("advances to step 2 when step 1 is valid and shows the services list", async () => {
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(
      await screen.findByRole("heading", { name: /services & pricing/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("spinbutton")).toHaveLength(4);
  });

  it("returns to step 1 when Back is clicked", async () => {
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByRole("heading", { name: /services & pricing/i });

    await userEvent.click(screen.getByRole("button", { name: /^back$/i }));
    expect(
      screen.getByRole("heading", { name: /personal & professional details/i }),
    ).toBeInTheDocument();
  });

  it("submits the doctor payload and navigates on a 201", async () => {
    post.mockResolvedValue({ status: 201 });
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByRole("heading", { name: /services & pricing/i });
    await fillStep2Prices();

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    await waitFor(() => {
      expect(post).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("does not display validation errors on price inputs initially on step 2, but displays them when typing invalid values or clearing", async () => {
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    await screen.findByRole("heading", { name: /services & pricing/i });

    expect(screen.queryByText(/Price is required/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Price must be greater than 0/i),
    ).not.toBeInTheDocument();

    const priceInputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];

    await userEvent.type(priceInputs[0], "0");
    expect(
      await screen.findByText(/Price must be greater than 0/i),
    ).toBeInTheDocument();

    await userEvent.clear(priceInputs[0]);
    await userEvent.tab();

    expect(await screen.findByText(/Price is required/i)).toBeInTheDocument();
  });

  it("surfaces a server error message", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: "Email already exists" } },
    });
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByRole("heading", { name: /services & pricing/i });
    await fillStep2Prices();

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(
      await screen.findByText(/email already exists/i),
    ).toBeInTheDocument();
  });

  it("falls back to a generic error for non-Axios failures", async () => {
    isAxiosError.mockReturnValue(false);
    post.mockRejectedValue(new Error("boom"));
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByRole("heading", { name: /services & pricing/i });
    await fillStep2Prices();

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(await screen.findByText(/unexpected error/i)).toBeInTheDocument();
  });
});
