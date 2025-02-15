import React, { useState, useEffect } from "react";
import keycloak from "./keycloak";
import logo from './logo.svg';
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <button onClick={() => keycloak.logout()}>Logout</button>
      </div>
    </div>
  );
}

export default App;
