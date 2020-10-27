import React, { useState, useReducer } from 'react';
import './App.css';
// import Login from './components/Login';
import AppRouter from './routers/AppRouter';
import CarFrontContext from './context/carfront-context';
import Header1 from './components/Header1';
import Header2 from './components/Header2';
import carsReducer from './reducers/carsReducer.js';
import Login from './components/Login';

function App() {

  const [isAuthenticated, setAuth] = useState(false);
  const [user, setUser] = useState({ username: '', password: '' });
  const [isAddCar, setIsAddCar] = useState(false);
  const [cars, setCars] = useState([]);
  const [state, dispatch] = useReducer(carsReducer, [])

  // return (
  //   <div className='App' >
  //     <CarFrontContext.Provider value={{
  //       isAuthenticated,
  //       setAuth, user, setUser,
  //       isAddCar, setIsAddCar, setCars, cars
  //     }} >
  //     <div>
  //       {(isAuthenticated) ? <Header2 /> : <Header1 />}
  //       <AppRouter />
  //       </div>
  //     </CarFrontContext.Provider>
  //   </div>
  // );
  return (
    <div className='App' >
      <CarFrontContext.Provider value={{
        isAuthenticated,
        setAuth, user, setUser,
        isAddCar, setIsAddCar, setCars, cars
      }} >
        <div>
          <AppRouter />
        </div>
      </CarFrontContext.Provider>
    </div>
  );

}

export default App;