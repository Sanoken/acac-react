import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import keycloak from "./keycloak";
import Header from "./components/header";
import Footer from "./components/footer";
import ThemeContextProvider from "./context/ThemeContext";
import Users from "./pages/Users";
import WaitingList from "./pages/WaitingList";
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
        <br /> <br />
        <div align="center">
            <img src="https://lh3.googleusercontent.com/pw/AP1GczMIWq8USOQE7vmzLYSjRbwa73T06MWVxDQygFeGNS4jhIDtyWxG4ds9VEY58jWHyaMfha7vwRz8RAlyLUebMrQsozG1cMioB8IE-Uoom7eV3JpZ-RkDkDIb5nscRSMNdUvWnhFti4Gs2zbM4eP_UOpEJw=w1278-h535-s-no-gm" />
          </div>
        <Routes>
          <Route path="/users" element={<Users />} /> 
          <Route path="/waitinglist" element={<WaitingList />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
