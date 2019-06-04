import { routerActions } from 'connected-react-router';
import openSocket from 'socket.io-client';
import store from '../store';

//MAP
export const TIMER_TICK = 'timer/TICK';
export const CURSOR_TAG = 'cursor/TAG/CHANGE';

export const NEW_LINE = 'lines/NEW';
export const INPUT_UPDATE = 'input/UPDATE';

let cursors = {};


const StartTimer = (ms)=>{
    return new Promise((resolve, reject)=>{
        try{
            var t = setInterval(()=>{
                for (let id in cursors){
                    if (cursors.hasOwnProperty(id)){
                        let c = cursors[id];
                        c.tick();
                    }
                }

            }, ms);

            resolve(t);
        }
        catch(err){
            reject(err);
        }
    });
}

let timer = StartTimer(100);

const initialState = {
    input: '',
    lines: [],
    timer: false,
    cursors:{}
};

export default (state = initialState, action)=>{
    switch(action.type){
        case INPUT_UPDATE:
            return {
                ...state,
                input: action.input
            }
        case NEW_LINE:
            return {
                ...state,
                lines: [...state.lines, action.text]
            }
        case TIMER_TICK:
            return {
                ...state,
                timer: !state.timer
            }
        case CURSOR_TAG:
            let cursors = state.cursors;
            let c = {};
            c[action.cursor.id] = action.cursor;
            cursors = Object.assign(cursors, c);

            return {
                ...state,
                timer: !state.timer,
                cursors
            }
        default:
            return state;
    }
}

export const createCursor = (cursor) => {
    return dispatch => {
        cursors[cursor.id] = cursor;

        dispatch({
            type:CURSOR_TAG,
            cursor: {id:cursor.id, tag: cursor.options.tag}
        });
    }
}

export const updateInput = (text) =>{
    return dispatch =>{
        dispatch({
            type: INPUT_UPDATE,
            input: text
        })
    }
}

export const enterCommand = (command) => {
    return dispatch => {
        //for now just display on screen
        dispatch({
            type: NEW_LINE,
            text: {text:command}
        })
    }
}