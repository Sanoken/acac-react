import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import keycloak from "./keycloak";
import Header from "./components/header";
import Footer from "./components/footer";
import ThemeContextProvider from "./context/ThemeContext";
import Users from "./pages/Users";
import WaitingList from "./pages/WaitingList";
import RaidContent from "./pages/RaidContent";

import './App.css';
import { getUsers } from "./services/userService";  // Import the getUsers function

function App() {
  const [userInfo, setUserInfo] = useState(() => {
    // Retrieve user info from localStorage on initial load
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  useEffect(() => {
    if (keycloak.authenticated) {
      // Cler localStorage on authentication to remove stale data
      localStorage.removeItem("userInfo");
      localStorage.removeItem("currentUser");
      
      keycloak.loadUserInfo()
        .then(info => {
          setUserInfo(info);
          // Store user info in localStorage
          localStorage.setItem("userInfo", JSON.stringify(info));

          // Fetch Keycloak Groups
         

          // Fetch full list of users from API
          getUsers()
            .then(users => {
              // Match Keycloak's preferred_username with discord value
              const matchedUser = users.find(user => user.discord === info.preferred_username);
              if (matchedUser) {
                // Store the matched user record in localStorage
                localStorage.setItem("currentUser", JSON.stringify(matchedUser));
               // console.log("Matched User:", matchedUser);
              }
            })
            .catch(err => {
              console.error('Failed to load users from API:', err);
            });
        })
        .catch(err => {
          console.error('Failed to load user info:', err);
        });
    }
  }, []);

  return (
    <ThemeContextProvider>
      <Router> 
        <Header />
        <br />
        <br />
        <main>
        <div align="center">
          <img src="https://lh3.googleusercontent.com/pw/AP1GczMIWq8USOQE7vmzLYSjRbwa73T06MWVxDQygFeGNS4jhIDtyWxG4ds9VEY58jWHyaMfha7vwRz8RAlyLUebMrQsozG1cMioB8IE-Uoom7eV3JpZ-RkDkDIb5nscRSMNdUvWnhFti4Gs2zbM4eP_UOpEJw=w1278-h535-s-no-gm" />
        </div>
        <Routes>
          <Route path="/users" element={<Users />} /> 
          <Route path="/waitinglist" element={<WaitingList />} />
          <Route path="/raid-content" element={<RaidContent />} />
        </Routes>
        </main>
        <Footer />
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
