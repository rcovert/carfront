import React, { useEffect, useContext, useState, useRef } from 'react';
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
    const { cars, setCars, isAddCar } = useContext(CarFrontContext);
    const localCars = useRef(0);

    let currentCar = {};
    let testArray = [];

    async function fetchCars() {
        // function calls the get api on cars
        //  and then sets cars array, which in turn 
        // sets the rows for the data grid
        const token = sessionStorage.getItem("jwt");
        // console.log('fetch called');
        const results = await fetch(SERVER_URL + 'api/cars',
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
        console.log("event array: ", theArray);

        //const carEvents = cars.map((theCar) => console.log(theCar) );
        //var obj = JSON.parse(localCars.current[0]);

        if (localCars.current[0] !== undefined) {
            console.log("cars from process eventArray ", localCars);
            console.log("cars from process eventArray ", localCars.current[0].price);
            if (rows[0] !== undefined) {
                console.log("rows from process eventArray ", rows[0]);
            }
        }
    }

    useEffect(() => {
        // on first time page load
        // just need to trigger car fetch by 
        fetchCars();
        // note need to fully define eventSource here for it to close properly
        const eventSource = new EventSource("http://localhost:8090/mono-sse")
        eventSource.addEventListener('single-event', (e) => {
            //console.log('SSE Data', e.data);
            const item = JSON.parse(e.data);
            testArray.push(item);
            processEventArray(testArray);
        });
        return () => { eventSource.close() }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // effect maps the api retrieve results to
        //  the grid rows and is fired whenever there is a change
        // to the cars array (add, edit, delete)
        let nrows = cars.map((car) => ({ id: uuid(), rowLink: car._links.self.href, ...car }));
        setRows(nrows);
        // cars are set 
        localCars.current = [...nrows];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cars]);

    function handleOnRowHover(RowParams) {
        // need to get the current car
        currentCar = RowParams.data;
        //console.log('current car is ', currentCar);
    }

    function handleOnRowSelected(RowParams) {
        currentCar = RowParams.data;
        //console.log('current car is ', currentCar)
    }

    function handleRowClick(rowData, rowState) {
        console.log(rowData, rowState)
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
                    onRowHover={handleOnRowHover} onRowSelected={handleOnRowSelected}
                    onRowClick={handleRowClick} />
            </div>
            {(isAddCar) ? <AddCar fetchCars={fetchCars} /> : null}
        </div >
    );
}

export { Dashboard as default };