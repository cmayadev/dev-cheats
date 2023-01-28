import { useState, useEffect } from 'react';

import Tool from '../../components/layout/Tool/Tool';

import styles from './PixelToRem.module.scss'

const PixelToRem = (props) => {

    const { setSidebar, title } = props;
    
    useEffect(() => {
        setSidebar(true);
    }, [setSidebar, true]);

    return ( 
        <Tool title={title}>
            
        </Tool>
    );
}

export default PixelToRem;