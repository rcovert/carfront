import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import createHistory from 'history/createBrowserHistory';
import SecuredRoute from './SecuredRoute';

export const history = createHistory();

const AppRouter = () => (
    <Router history={history}>
        <div>
            <Switch>
                <Route path="/" component={Login} exact={true} />
                <SecuredRoute path="/carlist" component={Dashboard} />
            </Switch>
        </div>
    </Router>
)

export default AppRouter;