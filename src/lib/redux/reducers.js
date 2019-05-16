import { combineReducers } from 'redux';
import  * as types  from './actionTypes';
import { app, resource, send, modal, preferences } from 'givebox-lib';

export function cloud(state = {
  openLeftMenu: false,
  status: '',
  justApproved: false
}, action) {
  switch (action.type) {
    case types.SET_CLOUD_PARAM:
      return Object.assign({}, state, {
        ...state,
        [action.key]: action.value
      });
    case types.OPEN_LEFT_MENU:
      return Object.assign({}, state, {
        ...state,
        openLeftMenu: true
      });
    case types.CLOSE_LEFT_MENU:
      return Object.assign({}, state, {
        ...state,
        openLeftMenu: false
      });
    case types.SET_STATUS:
      return Object.assign({}, state, {
        ...state,
        status: action.status
      });
    case types.SET_JUST_APPROVED:
      return Object.assign({}, state, {
        ...state,
        justApproved: action.justApproved
      });
    default:
      return state;
  }
}

const appReducer = combineReducers({
  preferences, app, cloud, resource, send, modal
})

const rootReducers = (state, action) => {

  if (action.type === 'USER_LOGOUT') {
    const { routing } = state;
    state = { routing };
  }

  return appReducer(state, action);
}

export default rootReducers;
