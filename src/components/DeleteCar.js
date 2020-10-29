import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { toast } from 'react-toastify';
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
}));

const DeleteCar = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    // Update car and close modal form
    const handleSave = () => {
        deleteCar(props.link);
        handleClose();
    }

    const deleteCar = () => {
        const token = sessionStorage.getItem("jwt");
        fetch(props.link,
            {
                method: 'DELETE',
                headers: { 'Authorization': token }
            })
            .then(res => {
                toast.success("Car deleted", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                props.fetchCars();
            })
            .catch(err => {
                toast.error("Error when deleting", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(err)
            })
    }

    const fabs = [
        {
            color: 'secondary',
            className: classes.fab,
            icon: <DeleteIcon />,
            label: 'Delete',
        }
    ];

    return (
        <div>
            <IconButton aria-label={fabs[0].label} className={fabs[0].className}
                color={fabs[0].color} size="small" onClick={handleClickOpen} >
                {fabs[0].icon}
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete car</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this vehicle?</p>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSave}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteCar;