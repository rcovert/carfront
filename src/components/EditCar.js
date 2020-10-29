import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

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

const EditCar = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [car, setCar] = useState({ brand: '', model: '', year: '', color: '', price: '' });

    const handleClickOpen = () => {
        setCar({
            brand: props.car.brand, model: props.car.model, color: props.car.color,
            year: props.car.year, fuel: props.car.fuel, price: props.car.price
        })
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setCar({ ...car, [event.target.name]: event.target.value });
    }

    const updateCar = () => {
        const token = sessionStorage.getItem("jwt");
        fetch(props.link,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(car)
            })
            .then(res => {
                toast.success("Changes saved", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                props.fetchCars();
            })
            .catch(err =>
                toast.error("Error when saving", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            )
    }

    // Update car and close modal form
    const handleSave = () => {
        updateCar(car, props.link);
        handleClose();
    }

    const fabs = [
        {
            color: 'primary',
            className: classes.fab,
            icon: <EditIcon />,
            label: 'Edit',
        }
    ];

    return (
        <div>
            <IconButton aria-label={fabs[0].label} className={fabs[0].className}
                color={fabs[0].color} size="small" onClick={handleClickOpen}>
                {fabs[0].icon}
            </IconButton>
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit car</DialogTitle>
                <DialogContent>
                    <TextField autoFocus fullWidth label="Brand" name="brand"
                        value={car.brand} onChange={handleChange} />
                    <TextField fullWidth label="Model" name="model"
                        value={car.model} onChange={handleChange} />
                    <TextField fullWidth label="Color" name="color"
                        value={car.color} onChange={handleChange} />
                    <TextField fullWidth label="Year" name="year"
                        value={car.year} onChange={handleChange} />
                    <TextField fullWidth label="Price" name="price"
                        value={car.price} onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditCar;