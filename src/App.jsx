import React, { useState, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout/Layout.jsx';

import Home from './pages/Home';

import tools from './api/tools.json';

import './App.css'

function App() {

  const [ sidebar, setSidebar ] = useState(false);

  return (
    <> 
      <Layout sidebar={sidebar}>
        <Suspense>
          <Routes>
            <Route path="/" element={<Home setSidebar={setSidebar} />} />
            {
              tools.map((tool, i) => {
                const Tool = React.lazy(() => import(`./pages/${tool.component}/${tool.component}.jsx`));
                return <Route key={i} path={tool.category + "/" + tool.slug} element={<Tool title={tool.title} setSidebar={setSidebar} />} />
              })
            }
          </Routes>
        </Suspense>
        <ToastContainer autoClose={8000} />
      </Layout>
    </>
  )
}

export default App
