"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { themeChange } from "theme-change";

const ThemeContext = createContext<{
  isOn: boolean;
  toggleSwitch: () => void;
}>({
  isOn: false,
  toggleSwitch: () => {},
});
let storedValue = "";

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOn, setIsOn] = useState<boolean>(
    storedValue ? JSON.parse(storedValue) : false
  );
  const toggleSwitch = () => {
    setIsOn((prevIsOn) => {
      const newIsOn = !prevIsOn;
      localStorage.setItem("isDarkmode", JSON.stringify(newIsOn));
      return newIsOn;
    });
  };

  useEffect(() => {
    themeChange(false);
    setIsOn(storedValue ? JSON.parse(storedValue) : false);
  }, []);

  return (
    <ThemeContext.Provider value={{ isOn, toggleSwitch }}>
      {children}
    </ThemeContext.Provider>
  );
};
