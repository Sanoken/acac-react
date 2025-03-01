import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  MenuItem,
  ListItemIcon
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  People, Bolt,
  Logout, AttachMoney,
  PlaylistAddCheck,
  SportsMartialArts,
} from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";
import keycloak from "../keycloak";

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUserInfo = useCallback(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setIsAdmin(parsedInfo.groups?.includes("nine-admin") || false);
      
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.discord === parsedInfo.preferred_username) {
          setCurrentUser(parsedUser);
        }
      }
    }
  }, []);

  useEffect(() => {
    checkUserInfo();
    window.addEventListener("storage", checkUserInfo);
    return () => window.removeEventListener("storage", checkUserInfo);
  }, [checkUserInfo]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentUser");
    keycloak.logout();
    console.log("User logged out and localStorage cleared");
  };

  const menuItems = [
    isAdmin && { path: "/users", icon: <People fontSize="small" />, label: "User Management" },
    { path: "/Loot", icon: <AttachMoney fontSize="small" />, label: "Loot" },
    isAdmin && { path: "/raid-content", icon: <SportsMartialArts fontSize="small" />, label: "Raid Content" },
    { path: "/alternate-weapons", icon: <Bolt fontSize="small" />, label: "Alternate Weapons" },
    { path: "/waitinglist", icon: <PlaylistAddCheck fontSize="small" />, label: "Waiting List" },
  ].filter(Boolean); // Remove `false` values if `isAdmin` is false

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? "#212121" : "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Avatar src="https://lds-img.finalfantasyxiv.com/h/5/4_6qlZUYui4tW5ktSgjd-uYbxk.png" />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            A Clear's A Clear
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {menuItems.map(({ path, icon, label }) => (
            <MenuItem key={path} component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              {label}
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
          <IconButton color="inherit" onClick={toggleTheme}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton color="inherit">
            {currentUser?.lodestoneimage ? (
              <Avatar src={currentUser.lodestoneimage} alt={currentUser.name} />
            ) : (
              <Avatar>{currentUser?.name?.[0] || "?"}</Avatar>
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;