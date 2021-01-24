
import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { Home } from './home';
import { Paths } from './routes-config';

export const Main: React.FC = () => (
    <StrictMode>
            <Router>
                <Switch>
                    <Route exact path={ Paths.HOME } component={ Home } />
                    <Redirect to={ Paths.HOME } />
                </Switch>
            </Router>
    </StrictMode>
);