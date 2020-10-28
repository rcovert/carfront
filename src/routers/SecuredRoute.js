import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import CarFrontContext from '../context/carfront-context';

const SecuredRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useContext(CarFrontContext);
    return (
        <Route {...rest} render={props => (
            isAuthenticated ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{
                        pathname: '/',
                        state: { from: props.location }
                    }} />
                )
        )} />
    )
}

export { SecuredRoute as default }