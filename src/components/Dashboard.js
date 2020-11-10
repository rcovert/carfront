import React, { useEffect, useContext } from 'react';
import { SERVER_URL } from '../constants.js';
import CarFrontContext from '../context/carfront-context';
import DataGridY from './DataGridY.tsx';

const Dashboard = () => {

    const { cars, setCars } = useContext(CarFrontContext);
    let testArray = [];
    async function fetchCars() {
        // function calls the get api on cars
        //  and then sets cars array, which in turn 
        // sets the rows for the data grid
        const token = sessionStorage.getItem("jwt");
        await fetch(SERVER_URL + 'api/cars',
            {
                headers: { 'Authorization': token }
            })
            .then((response) => response.json())
            .then((responseData) => {
                setCars(responseData._embedded.cars);
            })
            .catch(err => console.error(err));
    }

    const processEventArray = (theArray) => {
        //console.log("event array: ", theArray);
        //const carEvents = cars.map((theCar) => console.log(theCar) );
        //var obj = JSON.parse(localCars.current[0]);
        if (cars[0] !== undefined) {
            console.log("cars from process eventArray ", cars);
            console.log("cars from process eventArray ", cars[0].price);
        }
    }

    useEffect(() => {
        // on first time page load
        // just need to trigger car fetch by 
        fetchCars();
        // note need to fully define eventSource here for it to close properly
        const eventSource = new EventSource("http://localhost:8099/mono-sse?user=sseClient")
        eventSource.addEventListener('single-event', (event) => {
            //console.log('SSE Data', e.data);
            const item = JSON.parse(event.data);
            testArray.push(item);
            processEventArray(testArray);
        });
        return () => { 
            eventSource.close();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGridY fetchCars={fetchCars} />
        </div>
    )
}

export { Dashboard as default };