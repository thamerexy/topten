import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { GameProvider } from './context/GameContext.jsx'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </GameProvider>
  </React.StrictMode>
)
