import { useEffect } from 'react';
import Hero from '../components/layout/Hero/Hero.jsx';
import Tools from '../components/layout/Tools/Tools.jsx';

const Home = ({setSidebar}) => {

    useEffect(() => {
        setSidebar(false);
    }, [setSidebar, false]);

    return ( 
        <div className="home">
            <Hero />
            <Tools />
        </div>
    );
}

export default Home;