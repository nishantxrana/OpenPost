import React from "react";
import { useSelector } from "react-redux";

function ThemeChanger({ children }) {
    const { theme } = useSelector((state) => state.theme);
  return (
      <div className={theme}>
      <div className=" bg-white text-black dark:bg-[#0f0f0f] dark:text-white min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default ThemeChanger;
