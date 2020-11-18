import React, { useEffect, useContext, useState, useRef } from "react";
import { DataGrid, GridApi, GridOverlay } from "@material-ui/data-grid";
import { API_LINK, SSE_LINK } from "../constants.js";
import CarFrontContext from "../context/carfront-context";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import AddCar from "./AddCar";
import DeleteCar from "./DeleteCar";
import EditCar from "./EditCar";
import { randomInt } from "@material-ui/x-grid-data-generator";

const DataGridY = (props: any) => {
  const apiRef = useRef<GridApi | null>(null);

  //console.log("apiRef.current: ", apiRef.current);

  let currentCar: any = {};
  let eventArray: any = [];

  const { cars, isAddCar } = useContext(CarFrontContext);

  useEffect(() => {
    // this code demonstrates how to manipulate the datagrid api
    const rowModels = apiRef.current?.getRowModels();
    if (rowModels) {
      // apiRef.current?.setRowModels(
      //   rowModels.map((r) => {
      //     r.selected = r.data.color === "Greenhhhhh";
      //     return r;
      //   })
      // );
      //console.log("inside of use effect for cars: ", cars);
      console.log("apiRef.current: we have handle to grid api", apiRef.current);
    }
  }, [cars]);

  const processEventArray = (theArray: any) => {
    // read the event off the queue, process and then pop off the array
    // see scrap file for example on how to manipulate the table data api directly
    const theEvent = JSON.stringify(theArray[0]);
    console.log("event is: ", theEvent, theArray.length);
    eventArray.pop();
    const rowModels = apiRef.current?.getRowModels();
    const rowModelsLen = apiRef.current?.getRowsCount();
    props.fetchCars();
    toast.info("Table updated!", { position: toast.POSITION.BOTTOM_RIGHT });
  };

  useEffect(() => {
    // note need to fully define eventSource here for it to close properly
    const eventSource = new EventSource(SSE_LINK);
    eventSource.addEventListener("message", (evt: MessageEvent) => {
      //console.log("SSE Data", evt.data);
      const item = JSON.parse(evt.data);
      eventArray.push(item);
      processEventArray(eventArray);
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
          rows={cars}
          columns={columns}
        />
      </div>
      {isAddCar ? <AddCar fetchCars={props.fetchCars} /> : null}
    </div>
  );
};

export default DataGridY;
