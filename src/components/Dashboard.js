import React, { useEffect, useContext, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import CarFrontContext from '../context/carfront-context';
import Header from './Header';
import uuid from 'react-uuid';

const Dashboard = () => {

    const [rows, setRows] = useState([]); // rows are required for data grid
    const { cars, setCars, carFetch, setCarFetch } = useContext(CarFrontContext);

    //const [cars, dispatch] = useReducer(carsReducer, []);

    useEffect(() => {
        // get car data - should try to use reducer
        // dispatch({ type: 'FETCH_CARS', cars: [] });
        console.log('car fetch from page load = ' + carFetch);
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + 'api/cars',
            {
                headers: { 'Authorization': token }
            })
            .then((response) => response.json())
            .then((responseData) => {
                setCars(responseData._embedded.cars);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        // get car data - should try to use reducer
        // dispatch({ type: 'FETCH_CARS', cars: [] });
        // this is actually the re-fetch
        //if (carFetch) {
        const token = sessionStorage.getItem("jwt");
        console.log('car fetch 2 = ' + carFetch);
        fetch(SERVER_URL + 'api/cars',
            {
                headers: { 'Authorization': token }
            })
            .then((response) => response.json())
            .then((responseData) => {
                setCars(responseData._embedded.cars);
                //setCarFetch(0);
            })
            .catch(err => console.error(err));
        //}
    }, [carFetch]);

    useEffect(() => {
        let nrows = cars.map((car) => ({ id: uuid(), ...car }));
        setRows(nrows);
        //console.log(rows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cars]);

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
        headerName: '|',
        renderCell: () => (
            <strong>
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 16 }}
                >
                    Edit
              </Button>
            </strong>
        )
    }, {
        field: 'delete',
        headerName: '|',
        renderCell: () => (
            <strong>
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 16 }}
                >
                    Delete
              </Button>
            </strong>
        )
    }]

    return (
        <div><Header />
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection />
            </div>
        </div>
    );
}

export { Dashboard as default };