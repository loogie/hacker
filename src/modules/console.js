import { routerActions } from 'connected-react-router';
import openSocket from 'socket.io-client';
import store from '../store';

//MAP 
export const SERVER_CONNECTED = 'server/CONNECTED';

export const USER_PROFILE_UPDATE = 'user/PROFILE';
export const USER_LOGOUT = 'user/PROFILE';

export const COMMANDS_UPDATE = 'commands/UPDATE';

const initialState = {
    connected: false,
    user: null
};

export default (state = initialState, action)=>{
    switch(action.type){
        case SERVER_CONNECTED:
            return {
                ...state,
                connected:true
            }
        case USER_PROFILE_UPDATE:
            return {
                ...state, 
                user: action.user
            }
        case USER_LOGOUT:
                let s = state;
                s.user = null;

                return {
                    ...s
                }
        case COMMANDS_UPDATE:
            let commands = [...state.commands, action.commands.new_val];
            return {
                ...state,
                commands
            }
        default:
            return state;
    }
}

var socket;

export const socketConn = () => {
    return dispatch => {
        try{
            socket = openSocket('http://localhost:3030');
            socket.on('msg', (msg)=>{
                console.log("MESSAGE");
                console.log(msg);
            })

            dispatch({
                type: SERVER_CONNECTED
            });

            socket.on("user_error", user_error_handler);
        }
        catch(e){
            throw e;
        }
    }
}

export const createUser = (login) =>{
    return dispatch => {
        console.log(login);

        socket.on('user_validate', user_valid_handler);
        socket.emit('create_user', login);
    }
}

export const loginUser = (login) =>{
    return dispatch => {
        socket.on('user_validate', user_valid_handler);
        socket.emit('user_login', login);
    }
}

export const logout = () =>{
    return dispatch => {
        socket.emit('user_logout');
        dispatch({
            type: USER_LOGOUT
        });
    }
}

const user_error_handler = (e) => {
    throw e;
}

const user_valid_handler = (user) => {
    console.log("user validate");

    var dispatch = store.dispatch;

    if (user !== false){
        dispatch({
            type: USER_PROFILE_UPDATE,
            user
        })
    }
    else {
        dispatch({
            type: USER_PROFILE_UPDATE,
            user
        })
    }

    socket.off('user_validate', user_valid_handler);
}