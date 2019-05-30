import {createBrowserHistory} from 'history';
import {applyMiddleware, compose, createStore} from 'redux';
import {routerMiddleware} from 'connected-react-router';
import createRootReducer from './modules';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

const initialState = {};
const middleware = [
    routerMiddleware(history)
];

const composeEnhancers = 
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware)
);

const store = createStore(
    createRootReducer(history),
    initialState,
    compose(
        applyMiddleware(
            thunk,
            routerMiddleware(history), // for dispatching history actions
            // ... other middlewares ...
        ),
        enhancer
    )
);

export default store;
