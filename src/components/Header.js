import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import { green } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from "react-router-dom";
import CarFrontContext from '../context/carfront-context';
// eslint-disable-next-line no-unused-vars

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
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[600],
        },
    },
}));

export default function MenuAppBar() {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const { isAuthenticated, setAuth } = useContext(CarFrontContext);
    const { setUser } = useContext(CarFrontContext);
    const { setIsAddCar } = useContext(CarFrontContext);
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddCar = () => {
        // console.log('add car event handler');
        setIsAddCar(true);
        handleClose();
    }

    const handleLogout = () => {
        // set user back to null
        // erase the jwt from session storage
        // setAuth to false and push back to login
        // turn off sse event source
        setUser({ username: '', password: '' });
        sessionStorage.removeItem("jwt");
        setAuth(false);
        history.push('/');
        // need hard refresh to avoid odd problem with
        // mui data grid on re-login
        window.location.reload(true);
    };

    const fabs = [
        {
            color: 'primary',
            className: classes.fab,
            icon: <UpIcon />,
            label: 'Expand'
        },
        {
            color: 'secondary',
            className: classes.fab,
            icon: <EditIcon />,
            label: 'Edit'
        },
        {
            color: 'inherit',
            className: clsx(classes.fab, classes.fabGreen),
            icon: <AddIcon />,
            label: 'Add'
        },
    ];

    // now render header with conditional logic
    // based on login status of the user
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {isAuthenticated && (
                        <div>
                            <IconButton edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}>
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleAddCar}>Add New Car</MenuItem>
                                <MenuItem onClick={handleClose}>Export CSV File</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                            <Fab aria-label={fabs[2].label} className={fabs[2].className}
                                color={fabs[2].color} onClick={handleAddCar}>
                                {fabs[2].icon}
                            </Fab>
                        </div>
                    )}
                    <Typography variant="h6" className={classes.title}>
                        CarFront
                    </Typography>
                    {isAuthenticated && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>)}
                </Toolbar>
            </AppBar>
        </div>
    );
};