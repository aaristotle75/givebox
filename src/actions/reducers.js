import { combineReducers } from 'redux';
import { resource, send, modal } from 'givebox-lib';

const appReducer = combineReducers({
  resource, send, modal
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
