import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { SERVER_URL } from '../constants.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CarFrontContext from '../context/carfront-context';
import Header1 from './Header1.js';

const Login = () => {

    // retrieve items from context
    const { user, setUser } = useContext(CarFrontContext);
    let { isAuthenticated } = useContext(CarFrontContext);
    const { setAuth } = useContext(CarFrontContext);
    const history = useHistory();

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    const login = () => {
        if (!user.username || !user.password) {
            toast.warn("Somethis is missing. Check your username and password.", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            return;
        }
        // console.log(user);
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        })
            .then(res => {
                const jwtToken = res.headers.get('Authorization');
                if (jwtToken !== null) {
                    sessionStorage.setItem("jwt", jwtToken);
                    setAuth(true);
                    history.push('/carlist');
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
        <div>
            <Header1 />
            <ToastContainer autoClose={1500} />
            <TextField name="username"
                label="Username" onChange={handleChange} required={true} /><br />
            <TextField type="password" name="password"
                label="Password" onChange={handleChange} required={true} /><br /><br />
            <Button variant="outlined" color="primary"
                onClick={login}>
                Login
                </Button>
        </div>
    );
}

export default Login;