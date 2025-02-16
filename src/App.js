import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import keycloak from "./keycloak";
import Header from "./components/header";
import ThemeContextProvider from "./context/ThemeContext";
import Users from "./pages/Users";
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    if (keycloak.authenticated) {
        keycloak.loadUserInfo().then(info => setUserInfo(info));
       // console.log(userInfo.authenticated);
    }
  }, []);

  return (

    <ThemeContextProvider>
      <Router> { /* Add the Router component here */ }
        <Header />
        <Routes>
          <Route path="/users" element={<Users />} /> 
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
