import React, { useState } from 'react';
import './App.css';
import AppRouter from './routers/AppRouter';
import CarFrontContext from './context/carfront-context';
// import carsReducer from './reducers/carsReducer.js';

function App() {

  const [isAuthenticated, setAuth] = useState(false);
  const [user, setUser] = useState({ username: '', password: '' });
  const [isAddCar, setIsAddCar] = useState(false);
  const [cars, setCars] = useState([]);
  let   [eventSource, setEventSource] = useState();
  // const [state, dispatch] = useReducer(carsReducer, [])

  return (
    <div className='App' >
      <CarFrontContext.Provider value={{
        isAuthenticated,
        setAuth, user, setUser,
        isAddCar, setIsAddCar, setCars, cars,
        eventSource, setEventSource
      }} >
        <div>
          <AppRouter />
        </div>
      </CarFrontContext.Provider>
    </div>
  );

}

export default App;