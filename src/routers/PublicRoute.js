import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({
    // note use of ...props desstructuring and 
    // ...rest to get rest of properties from each component
    // being filtered by this function
    isAuthenticated,
    component: Component,
    ...rest
}) => (
        <Route {...rest} component={(props) => (
            isAuthenticated ? (
                <Redirect to="/dashboard" />
            ) :
                <Component {...props} />
        )} />
    );

const mapStateToProps = (state) => ({
    // note use of !! returns boolean state for true/false cases with
    // both undefined and strings
    isAuthenticated: !!state.auth.uid
});

// connect component to redux to get store values 
// for authentication
export default connect(mapStateToProps)(PublicRoute);