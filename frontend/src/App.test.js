import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./pages/Login";
import { AuthContext } from "./context/AuthContext";

// Mock function for login
const mockLogin = () => {};

describe("Authentication screens", () => {
  it("renders the login form", () => {
    render(
      <AuthContext.Provider value={{ login: mockLogin, user: null, isAuthenticated: false, logout: () => {} }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Connexion sécurisée/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenez dans votre espace/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
  });
});
