import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery
} from "@mui/material";
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  People,
  Bolt,
  Logout,
  AttachMoney,
  PlaylistAddCheck,
  SportsMartialArts,
} from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";
import keycloak from "../keycloak";

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          setIsAdmin(parsedInfo.groups.includes("nine-admin"));
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
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentUser");
    keycloak.logout();
    console.log("User logged out and localStorage cleared");
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const renderMenuItems = () => (
    <>
      {isAdmin && (
        <MenuItem component={Link} to="/users">
          <ListItemIcon><People fontSize="small" /></ListItemIcon>
          User Management
        </MenuItem>
      )}
      <MenuItem component={Link} to="/Loot">
        <ListItemIcon><AttachMoney fontSize="small" /></ListItemIcon>
        Loot
      </MenuItem>
      {isAdmin && (
        <MenuItem component={Link} to="/raid-content">
          <ListItemIcon><SportsMartialArts fontSize="small" /></ListItemIcon>
          Raid Content
        </MenuItem>
      )}
      <MenuItem component={Link} to="/alternate-weapons">
        <ListItemIcon><Bolt fontSize="small" /></ListItemIcon>
        Alternate Weapons
      </MenuItem>
      <MenuItem component={Link} to="/waitinglist">
        <ListItemIcon><PlaylistAddCheck fontSize="small" /></ListItemIcon>
        Waiting List
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
        Logout
      </MenuItem>
    </>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? "#212121" : "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          {isMobile ? (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Avatar src="https://lds-img.finalfantasyxiv.com/h/5/4_6qlZUYui4tW5ktSgjd-uYbxk.png" />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ ml: 2 }}>
            A Clear's A Clear
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box display="flex" alignItems="center" gap={2}>
            {renderMenuItems()}
          </Box>
        )}

        {/* Right Side Icons */}
        <Box display="flex" alignItems="center">
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

      {/* Mobile Drawer Navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            {isAdmin && (
              <ListItemButton component={Link} to="/users">
                <ListItemIcon><People fontSize="small" /></ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItemButton>
            )}
            <ListItemButton component={Link} to="/Loot">
              <ListItemIcon><AttachMoney fontSize="small" /></ListItemIcon>
              <ListItemText primary="Loot" />
            </ListItemButton>
            {isAdmin && (
              <ListItemButton component={Link} to="/raid-content">
                <ListItemIcon><SportsMartialArts fontSize="small" /></ListItemIcon>
                <ListItemText primary="Raid Content" />
              </ListItemButton>
            )}
            <ListItemButton component={Link} to="/alternate-weapons">
              <ListItemIcon><Bolt fontSize="small" /></ListItemIcon>
              <ListItemText primary="Alternate Weapons" />
            </ListItemButton>
            <ListItemButton component={Link} to="/waitinglist">
              <ListItemIcon><PlaylistAddCheck fontSize="small" /></ListItemIcon>
              <ListItemText primary="Waiting List" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;