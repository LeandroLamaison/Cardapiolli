import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import Detail from './pages/Detail';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import NewPlate from './pages/NewPlate';
import EditPlate from './pages/EditPlate';
import EditMenu from './pages/EditMenu';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} exact path='/' />
            <Route component={Register} exact path='/register'/>
            <Route component={Login} exact path='/login'/>
            <Route component={Detail} exact path='/detail/:menu' />
            <Route component={Profile} exact path='/profile/:menu' />
            <Route component={EditMenu} exact path='/profile/:menu/edit' />
            <Route component={NewPlate} exact path='/profile/:menu/new-plate'/>
            <Route component={EditPlate} exact path='/profile/:menu/:plate' />
        </BrowserRouter>
    );
}

export default Routes;