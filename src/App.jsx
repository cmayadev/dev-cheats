import { Routes, Route } from 'react-router-dom';
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
      </Layout>
    </>
  )
}

export default App
