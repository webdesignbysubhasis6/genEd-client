import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Auth0Provider
    domain="dev-bpvdtjpup4btekl6.us.auth0.com"
    clientId="NX29xbherGwX0tEIah5OKH4UFacH3HOe"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  > */}
  {/* </Auth0Provider>, */}
  
  <App/>

  </StrictMode>,
)
