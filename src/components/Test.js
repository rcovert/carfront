import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants.js';

function useA() {
    const [valueA, setValueA] = useState(null);
    const [errorA, setErrorA] = useState(null);
    const [loadingA, setLoadingA] = useState(true);
    const [cars, setCars] = useState(null);
    const token = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjA0ODY2NjEyfQ.PnL4mto7an6gvX8SdECkEmn3nHw2xEWdJT-NwxYUV5uZn1o2S8lbQRv7fSzoT3jjXyDZAWN36_nn6Vn4Y6gI-Q"

    async function getA() {
        try {
            setLoadingA(true);
            const cars = await fetch(
                SERVER_URL + 'api/cars',
                {
                    headers: { 'Authorization': token }
                })
                .then((response) => response.json())
                .then((responseData) => responseData._embedded.cars)
                .catch(err => console.error(err)
                )
            setCars(cars); 
        } catch (e) {
            setErrorA(e);
        } finally {
            setLoadingA(false);
        }
    }
    useEffect(() => {
        console.log("use effect")
        getA();
    }, []);

    return [cars, errorA, loadingA];
}

function FetchOneResource() {
    const [cars, errorA, loadingA] = useA();
    if (errorA) return "Failed to load resource A";
    return loadingA ? "Loading..." : cars;
}

export { FetchOneResource as default }