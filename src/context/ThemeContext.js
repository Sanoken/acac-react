import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "light" ? false : true;
    });

    const toggleTheme = () => {
        setDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    };

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "#121212" : "#f5f5f5";
    }, [darkMode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    primary: {
                        main: darkMode ? "#90caf9" : "#1976d2",
                    },
                    background: {
                        default: darkMode ? "#121212" : "#f5f5f5",
                        paper: darkMode ? "#1e1e1e" : "#ffffff",
                    },
                    text: {
                        primary: darkMode ? "#ffffff" : "#000000",
                    },
                },
            }),
        [darkMode]
    );

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
