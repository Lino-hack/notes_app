import { createContext, useEffect, useMemo, useState } from "react";

const defaultContext = {
  theme: "light",
  toggleTheme: () => {},
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("theme") || "light";
};

export const ThemeContext = createContext(defaultContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
