import React from "react";
import App from "./app.jsx";
import { HelmetProvider } from 'react-helmet-async';
import {createRoot} from 'react-dom/client'

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

//import ReactDOM from "react-dom";


/**
* Root of react site 
*
* Imports Helment provider for the page head
* And App which defines the content and navigation
*/

// Render the site https://reactjs.org/docs/react-dom.html#render
root.render(
  <React.StrictMode>
    
    <HelmetProvider>
        
      <App />
    
    </HelmetProvider>
    
      
  </React.StrictMode>,
  
);
