import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import RouterApp from 'routes';
import { hot } from 'react-hot-loader';
class Root extends React.Component {
    get devTools() {
        if (__DEBUG__) {
            if (!window.devToolsExtension) {
                const DevTools = require('containers/DevTools').default;
                return <DevTools />;
            } else {
                window.devToolsExtension.open();
            }
        }
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <BrowserRouter basename={this.props.basename}>
                    <RouterApp />
                </BrowserRouter>
            </Provider>
        );
    }
}

Root.propTypes = {
    basename: PropTypes.string,
    store: PropTypes.object
};
export default hot(module)(Root)