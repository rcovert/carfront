import React, { useEffect, useContext, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import { DataGrid } from '@material-ui/data-grid';
import { ToastContainer } from 'react-toastify';
import CarFrontContext from '../context/carfront-context';
import Header from './Header';
import AddCar from './AddCar';
import DeleteCar from './DeleteCar';
import EditCar from './EditCar';
import uuid from 'react-uuid';

const Dashboard = () => {

    const [rows, setRows] = useState([]); // rows are required for data grid
    const [informData, setInformData] = useState([]);
    
    const { cars, setCars, isAddCar, setEventSource } = useContext(CarFrontContext);
    const { eventSource } = useContext(CarFrontContext);
    let currentCar = {};

    //const [cars, dispatch] = useReducer(carsReducer, []);

    function resetEventSource() {
        console.log("should only be called once...");
        
        //const urlString = "http://localhost:8080/greetings/reactConsumer";
        setEventSource(new EventSource("http://localhost:8090/mono-sse"));
        
        console.log("SSE Ready State ", eventSource.readyState);
        if (eventSource.readyState === 2) { 
            console.log("opening event source again...")
            //eventSource = (new EventSource("http://localhost:8090/mono-sse"))
            setEventSource(new EventSource("http://localhost:8090/mono-sse"))};
        eventSource.addEventListener('open', () => console.log('SSE Open'));
        eventSource.addEventListener('error', (err) => {
            console.log('SSE Error', err);
            // eslint-disable-next-line default-case
            switch (err.target.readyState) {
                case EventSource.CONNECTING:
                    console.log('Reconnecting...');
                    break;
                case EventSource.CLOSED:
                    console.log('Connection failed, will not reconnect');
                    break;
        
            }}, false);
        eventSource.addEventListener('message', (e) => console.log('SSE Data', e.data));
        eventSource.addEventListener('periodic-event', (e) => console.log('SSE Data', e.data));
        eventSource.addEventListener('single-event', (e) => 
            console.log('SSE Data', JSON.parse(e.data)));

        eventSource.onmessage = e => {
            console.log(e.data);
            //setInformData(informData.concat(JSON.parse(e.data)));
            //console.log(informData);
        }
    }

    function fetchCars() {
        // function calls the get api on cars
        //  and then sets cars array, which in turn 
        // sets the rows for the data grid
        const token = sessionStorage.getItem("jwt");
        // console.log('fetch called');
        fetch(SERVER_URL + 'api/cars',
            {
                headers: { 'Authorization': token }
            })
            .then((response) => response.json())
            .then((responseData) => {
                setCars(responseData._embedded.cars);
                //console.log(rows);
            })
            .catch(err => console.error(err));
    }

    // function usePrevious(value) {
    //     const ref = useRef();
    //     useEffect(() => {
    //         ref.current = value;
    //     });
    //     return ref.current;
    // }

    useEffect(() => {
        // on first time page load
        // just need to trigger car fetch by 
        fetchCars();
        resetEventSource();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // effect maps the api retrieve results to
        //  the grid rows and is fired whenever there is a change
        // to the cars array (add, edit, delete)
        let nrows = cars.map((car) => ({ id: uuid(), rowLink: car._links.self.href, ...car }));
        setRows(nrows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cars]);

    function handleOnRowHover(RowParams) {
        // need to get the current car
        currentCar = RowParams.data;
        // console.log('current car is ', currentCar);
    }

    const columns = [{
        headerName: 'Brand',
        field: 'brand',
        width: 130
    }, {
        headerName: 'Model',
        field: 'model',
        width: 130
    }, {
        headerName: 'Color',
        field: 'color',
        width: 130
    }, {
        headerName: 'Year',
        field: 'year',
        width: 130
    }, {
        headerName: 'Price $',
        field: 'price',
        width: 130
    }, {
        field: 'edit',
        headerName: '| Edit',
        renderCell: ({ value, row }) => (<EditCar car={currentCar} link={currentCar.rowLink}
            fetchCars={fetchCars} />)
    }, {
        field: 'delete',
        headerName: '| Delete',
        renderCell: ({ value, row }) => (<DeleteCar car={currentCar} link={currentCar.rowLink}
            fetchCars={fetchCars} />
        )
    }]

    return (
        <div>
            <ToastContainer autoClose={1500} />
            <Header />
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection
                    onRowHover={handleOnRowHover} />
            </div>
            {(isAddCar) ? <AddCar fetchCars={fetchCars} /> : null}
        </div >
    );
}

export { Dashboard as default };