import 'isomorphic-fetch';
require('es6-promise').polyfill();
import Promise from 'babel-polyfill';
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import configureStore from 'reduxdir/configureStore';
// import 'utils/whistle.js';
// import 'utils/wp-1.0.js';
if (!window.Promise) {
    window.Promise = Promise;
}
import 'styles/base.scss';
const store = configureStore();
// // 挂载元素
const MOUNT_ELEMENT = document.getElementById('root');
let render = () => {
    ReactDOM.render(
        <Root store={store} basename={__BASENAME__} />,
        MOUNT_ELEMENT
    );
};

// Enable HMR and catch runtime errors in RedBox
if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        render(require('./containers/Root'));
    })
}
render();