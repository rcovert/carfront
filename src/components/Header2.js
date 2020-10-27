import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CarFrontContext from '../context/carfront-context';
import AddCar from './AddCar';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header2() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const { setAuth } = useContext(CarFrontContext);
    const { setUser } = useContext(CarFrontContext);
    const { isAddCar, setIsAddCar } = useContext(CarFrontContext);
    const history = useHistory();

    useEffect(() => {
        //console.log('from header 2 this should only run once')
        setIsAddCar(false);
    }, [setIsAddCar]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        console.log('close menu called');
        setAnchorEl(null);
    };

    const handleAddCar = () => {
        setIsAddCar(true);
        setAnchorEl(null);
    }

    const handleLogout = () => {
        setUser({ username: '', password: '' });
        sessionStorage.removeItem("jwt");
        //console.log('made it to logout');
        setAuth(false);
        history.push('/');
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        aria-haspopup="true"
                        onClick={handleMenu}>
                        <MenuIcon />
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        CarFront
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            {(isAddCar) ? <AddCar /> : null}
        </div>
    );
}