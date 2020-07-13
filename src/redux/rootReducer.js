import { combineReducers } from 'redux';
import userInfo from './modules/userInfo';
import hello from './modules/hello';

export default combineReducers({
    userInfo,
    hello
});