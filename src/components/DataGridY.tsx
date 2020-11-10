import React, { useEffect, useContext, useState, useRef } from 'react';
import { DataGrid, RowData, GridApi } from "@material-ui/data-grid";
import { API_LINK } from '../constants.js';
import CarFrontContext from '../context/carfront-context';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import AddCar from './AddCar';
import DeleteCar from './DeleteCar';
import EditCar from './EditCar';

const DataGridY = (props: any) => {
    const apiRef = React.useRef<GridApi | null>(null);
    console.log("apiRef.current: ", apiRef.current);

    let currentCar: any = {};
    const { cars, isAddCar } = useContext(CarFrontContext);

    useEffect(() => {
        //const rowModels = apiRef.current.getRowModels();
        const rowModels = apiRef.current?.getRowModels();
        console.log("inside of useeffect for cars ", rowModels)
        if (rowModels) {
          apiRef.current?.setRowModels(
            rowModels.map((r) => {
              r.selected = r.data.quantity > 20000;
              return r;
            })
          );
        }
      }, [cars]);
    
    function handleOnRowHover(RowParams: { data: {}; }) {
        // need to get the current car
        currentCar = RowParams.data;
        //console.log('current car is ', currentCar);
    }

    function handleOnRowSelected(RowParams: { data: {}; }) {
        currentCar = RowParams.data;
        console.log('current car is ', currentCar)
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
        renderCell: () => (<EditCar car={currentCar} link={API_LINK+currentCar.id}
            fetchCars={props.fetchCars} />)
    }, {
        field: 'delete',
        headerName: '| Delete',
        renderCell: () => (<DeleteCar car={currentCar} link={API_LINK+currentCar.id}
            fetchCars={props.fetchCars} />
        )
    }]

    return (
        <div>
            <ToastContainer autoClose={1500} />
            <Header />
            <div style={{ height: 500, width: '100%' }}>
            
                <DataGrid rows={cars}
                    columns={columns} pageSize={10} checkboxSelection
                    onRowHover={handleOnRowHover} onRowSelected={handleOnRowSelected}
                    components={{
                        noRowsOverlay: (params) => {
                          if (!apiRef.current) {
                            apiRef.current = params.api.current;
                          }
                          return <div>No rows</div>;
                        },
                      }} />
            </div>
            {(isAddCar) ? <AddCar fetchCars={props.fetchCars} /> : null}
        </div >
    );
}

export default DataGridY;