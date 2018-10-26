import { combineReducers } from 'redux';
import  * as types  from './actionTypes';
import { resource, send, modal } from 'givebox-lib';

export function boiler(state = {
  test: 'Hello World'
}, action) {
  switch (action.type) {
    default:
      return state
  }
}

const appReducer = combineReducers({
  resource, send, modal, boiler
})

const rootReducers = (state, action) => {
  /*
  if (action.type === 'USER_LOGOUT') {
    const { routing } = state;
    state = { routing };
  }
  */
  return appReducer(state, action);
}

export default rootReducers;
