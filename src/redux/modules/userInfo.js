import strings from 'strings';

// ------------------------------------
// Constants
// ------------------------------------
export const USER_INFO_UPDATE = 'USER_INFO_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function userInfo(value = initialState) {
    return {
        type: USER_INFO_UPDATE,
        payload: value
    };
};

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function getUserInfo() {
    return (dispatch, getState) => {
        fetchUserInfo(dispatch);
    };
};

export function fetchUserInfo(dispatch) {
    return fetch('/userInfo', {
            credentials: 'same-origin'
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.errcode !== 0) {
                if (json.errcode === 500) {
                    netFailedState.username = strings.NOT_LOGIN_MSG;
                    dispatch(userInfo(netFailedState));
                } else {
                    dispatch(userInfo(failedState));
                }
            } else {
                if (json.error) {
                    dispatch(userInfo(netFailedState));
                } else {
                    let {
                        username,
                        schcode,
                        stucode,
                        photolive,
                        identity,
                        pycc
                    } = json.data;
                    pycc = pycc === "master" ? 1 : 2;
                    dispatch(userInfo({
                        username,
                        schcode,
                        stucode,
                        failed: false,
                        photo: photolive,
                        identity,
                        pycc
                    }));
                }
            }
        })
        .catch(() => {
            dispatch(userInfo(netFailedState));
        });
}

export const actions = {
    userInfo,
    getUserInfo
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [USER_INFO_UPDATE]: (state, action) => {
        const {
            username,
            schcode,
            stucode,
            photo,
            failed,
            identity,
            pycc
        } = action.payload;
        return {
            username,
            schcode,
            stucode,
            photo,
            failed,
            identity,
            pycc
        };
    }
};

// ------------------------------------
// Reducer
// ------------------------------------
const failedState = {
    username: strings.LOGIN_FAILED,
    schcode: '',
    stucode: '',
    photo: '',
    failed: true,
    identity: '',
    pycc: -1
};
const netFailedState = {
    username: strings.NET_ERROR,
    schcode: '',
    stucode: '',
    photo: '',
    failed: true,
    identity: '',
    pycc: -1
};
const initialState = {
    username: strings.NOT_LOGIN,
    schcode: '',
    stucode: '',
    photo: '',
    failed: true,
    identity: '',
    pycc: -1
};
export default function userInfoReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
};