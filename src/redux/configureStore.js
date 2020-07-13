import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

export default function configureStore(initialState = {}) {
    // Compose final middleware and use devtools in debug environment
    let middleware = applyMiddleware(thunk);
    if (process.env.NODE_ENV === 'development') {
        const devTools = window.devToolsExtension ?
            window.devToolsExtension() :
            require('containers/DevTools').default.instrument();
        middleware = compose(middleware, devTools);
    }

    const store = createStore(
        rootReducer,
        initialState,
        middleware
    );
    if (process.env.NODE_ENV === 'development') {
        if (module.hot) {
            module.hot.accept('./rootReducer', () => {
                const nextRootReducer = require('./rootReducer').default;
                store.replaceReducer(nextRootReducer);
            });
        }
    }
    return store;
}