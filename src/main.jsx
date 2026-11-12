import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/index.css'
import './styles/shell.css'

const container = document.getElementById('root')
const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Prerendered pages carry markup; hydrate it. The dev server and the
// language-switch root ('/') start empty and render from scratch.
if (container.hasChildNodes()) hydrateRoot(container, tree)
else createRoot(container).render(tree)
