import strings from 'strings';
import { _fetch } from '../reduxHelper';

/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const GET_HELLO_LIST = 'GET_HELLO_LIST';

// ------------------------------------
// Actions
// ------------------------------------
// NOTE: "Action" is a Flow interface defined in https://github.com/TechnologyAdvice/flow-interfaces
// If you're unfamiliar with Flow, you are completely welcome to avoid annotating your code, but
// if you'd like to learn more you can check out: flowtype.org.
// DOUBLE NOTE: there is currently a bug with babel-eslint where a `space-infix-ops` error is
// incorrectly thrown when using arrow functions, hence the oddity.
export function helloList(value = initialState) {
    return {
        type: GET_HELLO_LIST,
        payload: value
    };
};

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function getHelloList() {
    return (dispatch, getState) => {
        return fetchHelloList(dispatch);
    };
}

function fetchHelloList(dispatch) {
    return _fetch('/api/hello/hellodata/hello', 4000)
        .then((response) => response.json())
        .then((json) => {
            if (!isNaN(json.errcode) && json.errcode !== 0) {
                failedState.msg = json.errmsg;
                dispatch(helloList(failedState));
            } else if (json.data) {
                dispatch(helloList({
                    helloText: strings.SUCCESS,
                    helloValue: json.data
                }));
            } else if (json.error) {
                failedState.msg = strings.NET_ERROR;
                dispatch(helloList(failedState));
            } else {
                if (json.errmsg) {
                    failedState.msg = json.errmsg;
                    dispatch(helloList(failedState));
                }
                dispatch(helloList(failedState));
            }
        })
        .catch((err) => {
            dispatch(helloList({
                helloText: (__DEBUG__ && err.message) ? err.message : strings.NET_ERROR,
                helloValue: ''
            }));
        });
}

export const actions = {
    helloList,
    getHelloList
};

const ACTION_HANDLERS = {
    [GET_HELLO_LIST]: (state, action) => {
        const { helloText, helloValue } = action.payload;
        return {
            helloText,
            helloValue
        };
    }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    helloText: '...',
    helloValue: ''
};
export default function helloInfoReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
};