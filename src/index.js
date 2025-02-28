import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keycloak from './keycloak';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

keycloak.init({ 
  onLoad: "login-required", 
  pkceMethod: undefined, 
  checkLoginIframe: false 
}).then(authenticated => {
  if (!authenticated) {
    console.log("User not authenticated");
  }

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );

}).catch(error => {
  console.error("Keycloak initialization failed", error);
});

reportWebVitals();
