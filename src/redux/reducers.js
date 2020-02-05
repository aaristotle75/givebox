import { combineReducers } from 'redux';
import  * as types  from './actionTypes';
import { app, resource, send, modal, preferences, custom } from 'givebox-lib';
import { gbx } from '../lib/redux/reducers';

const appReducer = combineReducers({
  gbx, preferences, app, resource, send, modal, custom
})

const rootReducers = (state, action) => {

  if (action.type === 'USER_LOGOUT') {
    const { routing } = state;
    state = { routing };
  }

  return appReducer(state, action);
}

export default rootReducers;
