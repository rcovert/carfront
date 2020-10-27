import React, { useEffect, useContext, useReducer, useState } from 'react';
import uuid from 'react-uuid';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import CarFrontContext from '../context/carfront-context';
import carsReducer from '../reducers/carsReducer';
import { SERVER_URL } from '../constants.js'
import Header2 from './Header2';
import Header3 from './Header3';

const DataGridDemo = () => {

    const { cars, setCars } = useContext(CarFrontContext);
    let [rows, setRows] = useState([]); // rows are required for data grid

    //const [cars, dispatch] = useReducer(carsReducer, []);

    const fetchCars = () => {
        // Read the token from the session storage
        // and include it to Authorization header
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + 'api/cars',
            {
                headers: { 'Authorization': token }
            })
            .then((response) => response.json())
            .then((responseData) => {
                setCars(responseData._embedded.cars);
                let nrows = cars.map((car) => ({ id: uuid(), ...car }));
                setRows(nrows);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        //get car data - should try to use reducer
        // dispatch({ type: 'FETCH_CARS', cars: [] });
        fetchCars();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        //console.log('trying cars outside of function')
        //console.log(cars);
        let nrows = cars.map((car) => ({ id: uuid(), ...car }));
        setRows(nrows);
        //console.log(rows);
    }, [cars]);

    useEffect(() => {
        //console.log('for rows');
        //console.log(rows);
    }, [rows]);

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
        <div><Header3 />
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection />
            </div>
        </div>
    );
}

export { DataGridDemo as default };