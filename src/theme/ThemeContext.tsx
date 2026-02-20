import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "./colors";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark" | "system">("system");
  const systemColorScheme = useColorScheme();

  const getEffectiveTheme = () => {
    if (mode === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return mode === "dark" ? darkTheme : lightTheme;
  };

  const theme = getEffectiveTheme();

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
