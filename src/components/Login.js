import React, { useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CarFrontContext from '../context/carfront-context';
import Header from './Header.js';
import { SERVER_URL } from '../constants.js';

const Login = () => {

    // retrieve items from context
    const { user, setUser } = useContext(CarFrontContext);
    const { setAuth } = useContext(CarFrontContext);
    const history = useHistory();

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    const login = (e) => {
        e.preventDefault();
        if (!user.username || !user.password) {
            toast.warn("Somethis is missing. Check your username and password.", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            return;
        }
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        })
            .then(res => {
                const jwtToken = res.headers.get('Authorization');
                if (jwtToken !== null) {
                    sessionStorage.setItem("jwt", jwtToken);
                    setAuth(true);
                    history.push('/dashboard');
                }
                else {
                    toast.warn("Check your username and password.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    })
                }
            })
            .catch(err => console.error(err))
    }

    return (
        <div >
            <Header />
            <ToastContainer autoClose={1500} />
            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <form onSubmit={login}>
                    <TextField name="username"
                        label="Username" onChange={handleChange} required={true} autoFocus /><br />
                    <TextField type="password" name="password"
                        label="Password" onChange={handleChange} required={true} /><br /><br />
                    <Button variant="outlined" color="primary" type="submit">
                        Login
                </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;