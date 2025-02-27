import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon, Avatar } from "@mui/material";
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon, People, Logout, PlaylistAddCheck, SportsMartialArts } from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";
import keycloak from "../keycloak";

const Header = () => {
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentUser, setCurrentUser] = useState(() => {
        // Retrieve from localStorage on initial load
        const storedUser = localStorage.getItem("currentUser");       
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isAdmin, setIsAdmin] = useState(false);    

    // Monitor localStorage changes for userInfo within the same tab
    useEffect(() => {
        const checkUserInfo = () => {
            const storedUserInfo = localStorage.getItem("userInfo");
            if (storedUserInfo) {
                const parsedInfo = JSON.parse(storedUserInfo);
                try {
                    
                if(parsedInfo.groups.includes('nine-admin')) {
                  setIsAdmin(true);  
                } else { 
                   setIsAdmin(false); 
                }
                } catch (error) { 
                    setIsAdmin(false);
                 }

                // If the discord value matches, update currentUser
                const storedUser = localStorage.getItem("currentUser");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser.discord === parsedInfo.preferred_username) {
                        setCurrentUser(parsedUser);
                    }
                }
            }
        };

        // Check for changes every second
        const intervalId = setInterval(checkUserInfo, 1000);

        // Clean up the interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleLogout = () => {
        handleMenuClose();
        // Clear all relevant data from localStorage
        localStorage.removeItem("userInfo");
        localStorage.removeItem("currentUser");
        keycloak.logout();
        console.log("User logged out and localStorage cleared");
    };

    return (
      <AppBar position="static" sx={{ backgroundColor: darkMode ? "#212121" : "#1976d2" }}>
          <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                  <Avatar src="https://lds-img.finalfantasyxiv.com/h/5/4_6qlZUYui4tW5ktSgjd-uYbxk.png" />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {darkMode ? "A Clear's A Clear" : "A Clear's A Clear"}
              </Typography>
              <IconButton color="inherit" onClick={toggleTheme}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* User Avatar with Menu */}
              <IconButton color="inherit" onClick={handleMenuOpen}>
                  {currentUser && currentUser.lodestoneimage ? (
                      <Avatar src={currentUser.lodestoneimage} alt={currentUser.name} />
                  ) : (
                      <Avatar>{currentUser ? currentUser.name[0] : "?"}</Avatar>
                  )}
              </IconButton>
              <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
              >
                    {isAdmin && ( 
                  <MenuItem component={Link} to="/users" onClick={handleMenuClose}>
                    <ListItemIcon>
                      <People fontSize="small" />
                    </ListItemIcon>
                  User Management
                  </MenuItem> 
                )}
                {isAdmin &&(
                  <MenuItem component={Link} to="/raid-content" onClick={handleMenuClose}>
                    <ListItemIcon>
                      <SportsMartialArts fontSize="small" />
                    </ListItemIcon>
                    Raid Content
                  </MenuItem>
                )}
                  <MenuItem component={Link} to="/alternate-weapons" onClick={handleMenuClose}>
                    <ListItemIcon>
                      <PlaylistAddCheck fontSize="small" />
                    </ListItemIcon>
                  Alternate Weapons
                  </MenuItem>
                  <MenuItem component={Link} to="/waitinglist" onClick={handleMenuClose}>
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
              </Menu>
          </Toolbar>
      </AppBar>
  );
};

export default Header;
