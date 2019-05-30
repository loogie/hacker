import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import socket from './socket';

export default (history) => combineReducers({
    router: connectRouter(history),
    //add any other reducers here
    socket
});