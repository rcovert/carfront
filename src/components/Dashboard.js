import React, { useEffect, useContext } from "react";
import { SERVER_URL } from "../constants.js";
import CarFrontContext from "../context/carfront-context";
import DataGridY from "./DataGridY.tsx";

const Dashboard = () => {
  const { cars, setCars } = useContext(CarFrontContext);
  async function fetchCars() {
    // function calls the get api on cars
    //  and then sets cars array, which in turn
    // sets the rows for the data grid
    const token = sessionStorage.getItem("jwt");
    const response = await fetch(SERVER_URL + "api/cars", {
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setCars(responseData._embedded.cars);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    fetchCars();
    console.log("cars are: ", cars)
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGridY fetchCars={fetchCars} />
    </div>
  );
};

export { Dashboard as default };
