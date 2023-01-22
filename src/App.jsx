import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout/Layout.jsx';

import Home from './pages/Home';
import Passwords from './pages/Passwords/Passwords';

import './App.css'

function App() {
  return (
    <> 
      <Layout>
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/passwords" element={<Passwords />} />
          </Routes>
        </div>
        <ToastContainer autoClose={8000} />
      </Layout>
    </>
  )
}

export default App
