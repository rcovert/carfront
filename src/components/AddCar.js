import React, { useState, useContext } from 'react';
import { SERVER_URL } from '../constants.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CarFrontContext from '../context/carfront-context';
import { toast } from 'react-toastify';

const AddCar = (props) => {

    const [open, setOpen] = useState(true);
    const [car, setCar] = useState({
        brand: '', model: '', color: '', year: '', fuel: '', price: ''
    });
    const [errorType, setErrorType] = useState(false)
    const [errorText, setErrorText] = useState('');
    const { setIsAddCar } = useContext(CarFrontContext);

    const addCar = (car) => {
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + 'api/cars',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(car)
            })
            .then(res => { 
                //console.log('inside add event need to re-fetch cars');
                //use fetch cars from parent to refresh after add
                toast.success("Vehicle added", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                props.fetchCars() })
            .catch(err => console.error(err))
    }

    // Close the modal form
    const handleClose = () => {
        setErrorType(false)
        setErrorText('')
        setCar({ brand: '', model: '', color: '', year: '', fuel: '', price: '' })
        setOpen(false);
        setIsAddCar(false);
    };

    // Save car and close modal form
    // note POST function api is in the parent
    const handleSave = () => {
        if (car.model && car.brand && car.year && car.price) {
            addCar(car);
            //setCarFetch(carFetch + 1);
            handleClose();
        } else {
            setErrorType(true);
            setErrorText('Incomplete information');
            //window.confirm('Incomplete information.  Please add all required car fields.')
        }
    }

    const handleChange = (event) => {
        setCar({ ...car, [event.target.name]: event.target.value });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New car</DialogTitle>
                <DialogContent>
                    <TextField autoFocus fullWidth label="Brand" name="brand"
                        value={car.brand} onChange={handleChange}
                        required={true} error={errorType}
                        helperText={errorText} />
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
    )
};

export default AddCar;