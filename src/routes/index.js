/*
 * @Author: wangshuya
 * @Date:   2019-01-17 15:13:51
 * @Last Modified by: liwei
 * @Last Modified time: 2020-07-13 12:35:07
 */
import React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { getStorage } from './helper';
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView';
import DemoView from 'views/DemoView';
// import { requireAuthentication } from './AuthenticatedComponent';
// import AnimatedRouter from 'react-animated-router'; //需要动画将AnimatedRouter替换Switch即可
import 'react-animated-router/animate.css';

const checkLogin = (nextState, replace) => {
    let loginIn = getStorage("login");
    if (!loginIn) {
        replace({
            pathname: '/hello'
        });
    }
}

export default withRouter(({ location }) => (
    <CoreLayout>
            <Route path='/hello'  component={HomeView} /> 
            <Route path='/demo'  component={DemoView} />
            <Redirect to='/hello' />
	</CoreLayout>
));