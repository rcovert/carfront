import React, { useEffect, useContext, useState } from "react";
import { SERVER_URL } from "../constants.js";
import { useHistory } from "react-router-dom";
import CarFrontContext from "../context/carfront-context";
import DataGridY from "./DataGridY.tsx";
import { useIdleTimer } from 'react-idle-timer';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const Dashboard = () => {

  const { cars, setCars } = useContext(CarFrontContext);
  const [showModal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [secondIdle, setSecondIdle] = useState(false)
  const timeout = 15000;
  const [remaining, setRemaining] = useState(timeout)

  const history = useHistory();

  const handleOnIdle = event => {
    console.log('user is idle', event)
    console.log('last active', getLastActiveTime());

    if (secondIdle) {
      handleLogout()
    } else {
      setModal(true);
      setOpen(true);
      setTimeout(() => {
        if (isIdle) {
          window.alert('still idle');
          console.log('still idle')
          handleLogout()
        } else {
          handleReset();
        }

      }, 5000);
      //handleReset();
      setSecondIdle(true); // force a log out if user still idle
    }

  }

  const handleLogout = () => {
    history.push('/');
    window.location.reload(true);
  }

  const handleStay = () => {
    handleReset();
    setOpen(false);
  }

  const handleOnActive = event => {
    //console.log('user is active', event)
    //console.log('time remaining', getRemainingTime())
    setSecondIdle(false);
  }

  const handleOnAction = (e) => {
    //console.log('user did something', e)
    setSecondIdle(false);
  }

  const { getRemainingTime, getLastActiveTime, reset,
    pause,
    resume, isIdle } = useIdleTimer({
      timeout,
      onAction: handleOnAction,
      onActive: handleOnActive,
      onIdle: handleOnIdle,
      debounce: 500
    })

  const handleReset = () => reset()

  // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  //   timeout: 1000 * 30 * 1,
  //   onIdle: handleOnIdle,
  //   onActive: handleOnActive,
  //   onAction: handleOnAction,
  //   debounce: 500
  // })

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
