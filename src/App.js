import React, { useState, useReducer } from 'react';
import './App.css';
import AppRouter from './routers/AppRouter';
import CarFrontContext from './context/carfront-context';
import FetchOneResource from './components/Test';
// import carsReducer from './reducers/carsReducer.js';

function App() {

  const [isAuthenticated, setAuth] = useState(false);
  const [user, setUser] = useState({ username: '', password: '' });
  const [isAddCar, setIsAddCar] = useState(false);
  const [cars, setCars] = useState([]);
  
  //const [cars, dispatch] = useReducer(carsReducer, [])

  // const result = FetchOneResource();
  // console.log("result is ", result)
  //if (result !== "Loading..." ) {setCars(result._embedded.cars)};

  return (
    <div className='App' >
      <CarFrontContext.Provider value={{
        isAuthenticated,
        setAuth, user, setUser,
        isAddCar, setIsAddCar, cars, setCars
      }} >
        <div>
          <AppRouter />
        </div>
      </CarFrontContext.Provider>
    </div>
  );

}

export default App;