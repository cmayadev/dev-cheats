import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout/Layout.jsx';

import Home from './pages/Home';
import Passwords from './pages/Passwords/Passwords';

import './App.css'

function App() {

  const [ sidebar, setSidebar ] = useState(false);

  return (
    <> 
      <Layout sidebar={sidebar}>
        <div className={`main${sidebar ? ' has-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Home setSidebar={setSidebar} />} />
            <Route path="/passwords" element={<Passwords setSidebar={setSidebar} />} />
          </Routes>
        </div>
        <ToastContainer autoClose={8000} />
      </Layout>
    </>
  )
}

export default App
