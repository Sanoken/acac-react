import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Menu as MenuIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon, AccountCircle, People, Logout } from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";
import keycloak from "../keycloak";

const Header = () => {
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };
    
    const handleLogout = () => {
      handleMenuClose();
      keycloak.logout()
      console.log("User logged out");
    };

    return (
      <AppBar position="static" sx={{ backgroundColor: darkMode ? "#212121" : "#1976d2" }}>
          <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu">
                  <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {darkMode ? "A Clear's A Clear" : "A Clear's A Clear"}
              </Typography>
              <IconButton color="inherit" onClick={toggleTheme}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* User Account Icon with Menu */}
              <IconButton color="inherit" onClick={handleMenuOpen}>
                  <AccountCircle />
              </IconButton>
              <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
              >
                  <MenuItem component={Link} to="/users" OnClick={handleMenuClose}>
                    <ListItemIcon>
                      <People fontSize="small" />
                    </ListItemIcon>
                  User Management
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
