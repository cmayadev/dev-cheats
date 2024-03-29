import { useState, useEffect } from 'react';

import Input from '../../components/ui/Input/Input';
import Tool from '../../components/layout/Tool/Tool';

import styles from './PixelToRem.module.scss'

const PixelToRem = (props) => {

    const { setSidebar, title } = props;

    const [ rem, setRem ] = useState(1);
    const [ pixels, setPixels ] = useState(16);
    const [ fontSize, setFontSize ] = useState(16);
    const [ swapped, setSwapped ] = useState(false);
    const [ activeInput, setActiveInput ] = useState("rem");

    const validateInput = (e) => {
        const pattern = /^[0-9]*[.,]?[0-9]*$/;
        if (!pattern.test(e.target.value)) {
            e.preventDefault();
            return false;
        }
        return true;
    }

    const handleFontSize = (e) => {
        if (validateInput(e)) {
            setFontSize(e.target.value);
            if(swapped) {
                let value = pixels / e.target.value;
                value = Math.round((value + Number.EPSILON) * 1000) / 1000;
                setPixels(pixels);
                setRem(value);
            } else {
                let value = rem * e.target.value;
                setPixels(value);
                setRem(rem);
            }

        }
    }

    const handleRemChange = (e) => {
        if (validateInput(e)) {
            setRem(e.target.value);
            setPixels(e.target.value * fontSize);
            setActiveInput("px");
        }
    };
    
    const handlePixelsChange = (e) => {
        if (validateInput(e)) {
            setPixels(e.target.value);
            let value = e.target.value / fontSize;
            value = Math.round((value + Number.EPSILON) * 1000) / 1000;
            setRem(value);
            setActiveInput("rem");
        }
    };

    const swapValues = () => {
        setSwapped(!swapped);
    };
    
    useEffect(() => {
        setSidebar(true);
    }, [setSidebar, true]);

    return ( 
        <Tool title={title}>
            <div className={`${styles.converter} ${swapped ? styles.swapped : ''} ${styles[activeInput]}`}>
                <Input abbr="rem" type="text" value={rem} decimals="3" format="technical" onChange={handleRemChange} />
                <a className={styles.swap} title="Swap" onClick={swapValues}>⇄</a>
                <Input abbr="px" type="text" value={pixels} decimals="3" format="technical" onChange={handlePixelsChange} />
            </div>
            <div className={styles.toolContainer}>
                <p>Calculated with a root font-size of:</p> 
                <Input abbr="px" size="m" type="text" value={fontSize} onChange={handleFontSize} />
            </div>
        </Tool>
    );
}

export default PixelToRem;