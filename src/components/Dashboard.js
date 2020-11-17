import React, { useEffect, useContext, useState, useRef } from "react";
import { SERVER_URL } from "../constants.js";
import { useHistory } from "react-router-dom";
import CarFrontContext from "../context/carfront-context";
import axios from 'axios';
import DataGridY from "./DataGridY.tsx";
import { useIdleTimer } from 'react-idle-timer';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {

  const { cars, setCars } = useContext(CarFrontContext);
  const [showModal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const secondIdle = useRef();
  const timeout = 10 * 60 * 1000;

  const history = useHistory();

  const handleOnIdle = event => {
    console.log('user is idle', event)
    console.log('last active', getLastActiveTime());
    setModal(true);
    setOpen(true);
    console.log('isIdle is : ', isIdle());
    console.log('secondIdle is : ', secondIdle.current);
    setTimeout(() => {
      if (isIdle() && secondIdle.current) {
        console.log('still idle')
        //window.alert('still idle');
        handleLogout()
      } else {
        secondIdle.current = true;
        handleReset();
      }
    }, 5000);
    //handleReset();
  }

  const handleLogout = () => {
    history.push('/');
    window.location.reload(true);
  }

  const handleStay = () => {
    handleReset();
    secondIdle.current = false;
    setOpen(false);
  }

  const handleOnActive = event => {
    //console.log('user is active', event)
    //console.log('time remaining', getRemainingTime())
    secondIdle.current = false;
  }

  const handleOnAction = (e) => {
    //console.log('user did something', e)
    secondIdle.current = false;
  }

  const { getLastActiveTime, reset, resume,
    isIdle } = useIdleTimer({
      timeout,
      onAction: handleOnAction,
      onActive: handleOnActive,
      onIdle: handleOnIdle,
      debounce: 500
    })

  const handleReset = () => {
    reset();
    fetchCars();
  }

  const fetchCars = async () => {
    // function calls the get api on cars
    //  and then sets cars array, which in turn
    // sets the rows for the data grid
    const token = sessionStorage.getItem("jwt");
    const options = {
      headers: {'Authorization': token}
    };
    console.log("fetch called...")
    setIsLoading(true);
    const result = await axios.get(SERVER_URL + "api/cars", options);
    setCars(result.data._embedded.cars);
    setIsLoading(false);
    console.log(result.data);
      
    return result;
  }

  useEffect(() => {
    fetchCars();
    
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ height: 500, width: "100%" }}>
       <ToastContainer autoClose={500} />
      {isLoading ? (
        toast.info("Table updated!", { position: toast.POSITION.BOTTOM_RIGHT }) ) : (<DataGridY fetchCars={fetchCars} />)}
      {showModal && (
        <div>
          <Dialog open={open} >
            <DialogTitle>Time Out</DialogTitle>
            <DialogContent>
              <p>You have timed out.  Do you want to stay or logout?</p>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={handleStay}>Stay</Button>
              <Button color="primary" onClick={handleLogout}>Logout</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export { Dashboard as default };
