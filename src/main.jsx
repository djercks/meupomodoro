import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)