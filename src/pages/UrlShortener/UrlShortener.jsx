import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

import Copy from '/copy.svg';
import Button from '../../components/ui/Button/Button';
import Tool from '../../components/layout/Tool/Tool';

import styles from './UrlShortener.module.scss';

function URLShortener(props) {

    const { setSidebar, title } = props;
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");

    useEffect(() => {
        setSidebar(true);
    }, [setSidebar, true]);

    const handleChange = (event) => {
        setUrl(event.target.value);
    };

    const fetchData = async () => {
        try {
            if(url) {
                const response = await axios(
                    `https://api.shrtco.de/v2/shorten?url=${url}`
                );
                setShortenedUrl(response.data.result.full_short_link);
            } else {

            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleCopy = () => {
        if (shortenedUrl) {
            navigator.clipboard.writeText(shortenedUrl);
            toast.success("Url copied to clipboard!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <Tool title={title}>
            <div className={styles.url}>
                <input type="text" value={url} placeholder="http://www.example.com" onChange={handleChange} />
            </div>
            <div className={styles.shortened}>
                <div>
                    <a href={shortenedUrl} target="_blank">{shortenedUrl}</a>
                    <button className={styles.copy} onClick={handleCopy}>
                        <img src={Copy} alt="Copy to clipboard" />
                    </button>    
                </div>
                <Button type="primary" onClick={() => { fetchData(); }}>Acortar</Button>
            </div>
        </Tool>
    );
}

export default URLShortener;