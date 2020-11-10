import React, { useEffect, useContext, useState, useRef } from "react";
import { DataGrid, RowData, GridApi } from "@material-ui/data-grid";
import { API_LINK } from "../constants.js";
import CarFrontContext from "../context/carfront-context";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import AddCar from "./AddCar";
import DeleteCar from "./DeleteCar";
import EditCar from "./EditCar";
import {
  useDemoData,
  randomInt,
  randomUserName,
} from "@material-ui/x-grid-data-generator";

const DataGridY = (props: any) => {
  const apiRef = useRef<GridApi | null>(null);
  console.log("apiRef.current: ", apiRef.current);

  let currentCar: any = {};
  let eventArray: any = [];

  const { cars, isAddCar } = useContext(CarFrontContext);

  useEffect(() => {
    //const rowModels = apiRef.current.getRowModels();
    const rowModels = apiRef.current?.getRowModels();
    console.log("inside of use effect for cars: ", rowModels);
    if (rowModels) {
      apiRef.current?.setRowModels(
        rowModels.map((r) => {
          r.selected = r.data.color === "Green";
          return r;
        })
      );
    }
  }, [cars]);

  const processEventArray = (theArray: any) => {
    //console.log("event array: ", theArray);
    const rowModels = apiRef.current?.getRowModels();
    const rowModelsLen = apiRef.current!.getRowsCount() | 0;
    console.log("rows in event process ", rowModels, rowModelsLen);
    for (let inum in rowModels) {
      console.log(Number(inum), rowModels[Number(inum)].data);
    }
    // server side event received
    // simulate process of event by updating car in database and
    // reflect change to grid without doing fetchCars
    const theIndex = randomInt(0, rowModelsLen - 1);
    console.log("the index is ", theIndex);
    if (rowModelsLen !== 0) {
      let currentCar = apiRef.current!.getRowModels()[theIndex].data;
      console.log("current car is ", currentCar);
      console.log("current car id is ", currentCar.id);
      apiRef.current?.updateRowData([
        {
          id: currentCar.id,
          //color: {car.color === 'Green' ? 'Red' : 'Green'},
          year: 2010,
          color: "Green",
        }
      ]);
    }

    if (cars[0] !== undefined) {
      console.log("cars from process eventArray ", cars);
      console.log("cars from process eventArray ", cars[0].price);
    }
  };

  useEffect(() => {
    // note need to fully define eventSource here for it to close properly
    const eventSource = new EventSource(
      "http://localhost:8099/mono-sse?user=sseClient"
    );
    eventSource.addEventListener("message", (evt: MessageEvent) => {
      //console.log('SSE Data', e.data);
      const item = JSON.parse(evt.data);
      eventArray.push(item);
      processEventArray(eventArray);
      eventArray.pop(item);
    });
    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line
  }, []);

  function handleOnRowHover(RowParams: { data: {} }) {
    // need to get the current car
    currentCar = RowParams.data;
    //console.log('current car is ', currentCar);
  }

  function handleOnRowSelected(RowParams: { data: {} }) {
    currentCar = RowParams.data;
    //console.log("current car is ", currentCar);
  }

  const columns = [
    {
      headerName: "Brand",
      field: "brand",
      width: 130,
    },
    {
      headerName: "Model",
      field: "model",
      width: 130,
    },
    {
      headerName: "Color",
      field: "color",
      width: 130,
    },
    {
      headerName: "Year",
      field: "year",
      width: 130,
    },
    {
      headerName: "Price $",
      field: "price",
      width: 130,
    },
    {
      field: "edit",
      headerName: "| Edit",
      renderCell: () => (
        <EditCar
          car={currentCar}
          link={API_LINK + currentCar.id}
          fetchCars={props.fetchCars}
        />
      ),
    },
    {
      field: "delete",
      headerName: "| Delete",
      renderCell: () => (
        <DeleteCar
          car={currentCar}
          link={API_LINK + currentCar.id}
          fetchCars={props.fetchCars}
        />
      ),
    },
  ];

  return (
    <div>
      <ToastContainer autoClose={1500} />
      <Header />
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={cars}
          columns={columns}
          pageSize={10}
          checkboxSelection
          onRowHover={handleOnRowHover}
          onRowSelected={handleOnRowSelected}
          components={{
            noRowsOverlay: (params) => {
              if (!apiRef.current) {
                apiRef.current = params.api.current;
              }
              return <div>No rows</div>;
            },
          }}
        />
      </div>
      {isAddCar ? <AddCar fetchCars={props.fetchCars} /> : null}
    </div>
  );
};

export default DataGridY;
