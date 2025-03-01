import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  People,Bolt,
  Logout,
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

  useEffect(() => {
    const checkUserInfo = () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const parsedInfo = JSON.parse(storedUserInfo);
        try {
          if (parsedInfo.groups.includes("nine-admin")) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          setIsAdmin(false);
        }
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.discord === parsedInfo.preferred_username) {
            setCurrentUser(parsedUser);
          }
        }
      }
    };

    const intervalId = setInterval(checkUserInfo, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentUser");
    keycloak.logout();
    console.log("User logged out and localStorage cleared");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? "#212121" : "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Avatar src="https://lds-img.finalfantasyxiv.com/h/5/4_6qlZUYui4tW5ktSgjd-uYbxk.png" />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {darkMode ? "A Clear's A Clear" : "A Clear's A Clear"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {isAdmin && (
            <MenuItem component={Link} to="/users">
              <ListItemIcon>
                <People fontSize="small" />
              </ListItemIcon>
              User Management
            </MenuItem>
          )}
          {isAdmin && (
            <MenuItem component={Link} to="/raid-content">
              <ListItemIcon>
                <SportsMartialArts fontSize="small" />
              </ListItemIcon>
              Raid Content
            </MenuItem>
          )}
          <MenuItem component={Link} to="/alternate-weapons">
            <ListItemIcon>
              <Bolt fontSize="small" />
            </ListItemIcon>
            Alternate Weapons
          </MenuItem>
          <MenuItem component={Link} to="/waitinglist">
            <ListItemIcon>
              <PlaylistAddCheck fontSize="small" />
            </ListItemIcon>
            Waiting List
          </MenuItem>
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
            {currentUser && currentUser.lodestoneimage ? (
              <Avatar src={currentUser.lodestoneimage} alt={currentUser.name} />
            ) : (
              <Avatar>{currentUser ? currentUser.name[0] : "?"}</Avatar>
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
