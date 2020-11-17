import React, { useEffect, useContext, useState, useRef } from "react";
import { DataGrid, GridApi, GridOverlay } from "@material-ui/data-grid";
import LinearProgress from "@material-ui/core/LinearProgress";
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

  console.log("apiRef.current: ", apiRef.current);

  let currentCar: any = {};
  let eventArray: any = [];

  const { cars, isAddCar, setCars } = useContext(CarFrontContext);

  useEffect(() => {
    // this code demonstrates how to manipulate the datagrid api
    const rowModels = apiRef.current?.getRowModels();
    console.log("inside of use effect for cars: ", cars);
    if (rowModels) {
      apiRef.current?.setRowModels(
        rowModels.map((r) => {
          r.selected = r.data.color === "Greenhhhhh";
          return r;
        })
      );
    }
  }, [cars]);

  const processEventArray = (theArray: any) => {
    // read the event off the queue, process and then pop off the array
    // see scrap file for example on how to manipulate the table data api directly
    const theEvent = JSON.stringify(theArray[0]);
    console.log("event is: ", theEvent, theArray.length);
    eventArray.pop();
    const rowModelsLen = apiRef.current!.getRowsCount() | 0;
    // server side event received
    // simulate process of event by updating car in database and
    // reflect change to grid without doing fetchCars
    const theIndex = randomInt(0, rowModelsLen - 1);
    if (rowModelsLen !== 0) {
         let currentCar = apiRef.current!.getRowModels()[theIndex].data;
      //console.log("current car is ", currentCar);
      apiRef.current?.updateRowData([
        {
          id: currentCar.id,
          color: currentCar.color === "Green" ? "Red" : "Green",
          year:
            currentCar.year > 2010 ? currentCar.year - 1 : currentCar.year + 1,
        },
      ]);
      const rowModels = apiRef.current!.getRowModels();
      apiRef.current?.setRowModels(
        rowModels.map((r) => {
          r.selected = r.data.color === "Green";
          return r;
        })
      );
    }

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
    console.log("current car is ", currentCar);
  }

  function CustomLoadingOverlay() {
    return (
      <GridOverlay>
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
          <LinearProgress />
        </div>
      </GridOverlay>
    );
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
            loadingOverlay: CustomLoadingOverlay,
          }}
        />
      </div>
      {isAddCar ? <AddCar fetchCars={props.fetchCars} /> : null}
    </div>
  );
};

export default DataGridY;
