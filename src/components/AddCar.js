import React, { useState, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CarFrontContext from '../context/carfront-context';

const AddCar = (props) => {

    const [open, setOpen] = useState(false);
    const [car, setCar] = useState({
        brand: '', model: '', color: '', year: '', fuel: '', price: ''
    });
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('');
    const { setIsAddCar } = useContext(CarFrontContext);

    // Open the modal form
    // useEffect(() => {
    //     console.log('add car this should only run once')
    //     setCar({ brand: '', model: '', color: '', year: '', fuel: '', price: '' })
    //     setOpen(true);
    // }, []);

    // Open the modal form
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Close the modal form
    const handleClose = () => {
        setError(false)
        setErrorText('')
        setCar({ brand: '', model: '', color: '', year: '', fuel: '', price: '' })
        setOpen(false);
        setIsAddCar(false);
    };

    // Save car and close modal form
    // note POST function api is in the parent
    const handleSave = () => {
        if (car.model && car.brand && car.year & car.price) {
            props.addCar(car);
            handleClose();
        } else {
            setError(true);
            setErrorText('Incomplete information');
            //window.confirm('Incomplete information.  Please add all required car fields.')
        }
        //handleClose();
    }

    const handleChange = (event) => {
        setCar({ ...car, [event.target.name]: event.target.value });
    }
    return (
        <div>
            <Button style={{ margin: 10 }} variant='contained' color='primary' onClick={handleClickOpen}>New Car</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New car</DialogTitle>
                <DialogContent>
                    <TextField autoFocus fullWidth label="Brand" name="brand"
                        value={car.brand} onChange={handleChange}
                        required={true} error={error}
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