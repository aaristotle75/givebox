import { combineReducers } from 'redux';
import  * as types  from './actionTypes';

export function gbx(state = {
  test: false
}, action) {
  switch (action.type) {
    case types.TEST_ACTION:
      return Object.assign({}, state, {
        ...state,
        test: true
      });
    default:
      return state;
  }
}

const appReducer = combineReducers({
  gbx
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
