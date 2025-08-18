import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../app/src/App'
import './index.css'

const Main = () => {
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)

export default Main