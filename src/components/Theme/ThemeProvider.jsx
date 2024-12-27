import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

// Creating a context for theme state management
const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
});

// Functional component for ThemeProvider
const ThemeProvider = ({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

// Prop validation for ThemeProvider
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.oneOf(['dark', 'light', 'system']),
  storageKey: PropTypes.string
};

// Custom hook to use the theme context
const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { ThemeProvider, useTheme };
export default ThemeProvider;
