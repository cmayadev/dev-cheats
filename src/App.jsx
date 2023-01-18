import Layout from './components/layout/Layout/Layout.jsx';
import Hero from './components/layout/Hero/Hero.jsx';
import Tools from './components/layout/Tools/Tools.jsx';

import './App.css'

function App() {
  return (
    <> 
      <Layout>
        <div className="main">
          <div className="home">
            <Hero />
            <Tools />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default App
