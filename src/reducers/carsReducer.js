import { SERVER_URL } from '../constants.js'

const carsReducer = (state, action) => {

    async function fetchCars() {
        // Read the token from the session storage
        // and include it to Authorization header
        const token = sessionStorage.getItem("jwt");
        const res = await fetch(SERVER_URL + 'api/cars',
            {
                headers: { 'Authorization': token }
            });
        const body = await res.json();
        
        console.log('body is ' + body);
        return body;
    }

    // reducer takes state and applies action to return new state
    switch (action.type) {
        case 'FETCH_CARS':
            console.log('inside of reducer switch');
            //const token = sessionStorage.getItem("jwt");
            // fetch(SERVER_URL + 'api/cars',
            //     {
            //         headers: { 'Authorization': token }
            //     })
            //     .then((response) => response.json())
            //     .then((responseData) => {
            //         action.cars = responseData._embedded.cars;
            //         //console.log(responseData._embedded.cars);
            //         console.log(action.cars);
            //     })
            //     .catch(err => console.error(err));
            fetchCars();
            console.log('post fetch');
            console.log(action.cars);
            return action.cars;
        case 'ADD_CAR':
            return [...state, { title: action.title, body: action.body }];
        case 'REMOVE_CAR':
            console.log('title - ' + action.title);
            // return action.items.notes.filter((note) => note.title !== action.items.title);
            return state.filter((note) => note.title !== action.title)
        case 'EDIT_CAR':
            console.log('update car here')
            return action.notes;
        default:
            console.log('default?');
            return state;

    }
}

export { carsReducer as default };