import * as types from './actionTypes';

// Create any actions that interact with the redux store reducer

export function userLogout() {
  return {
    type: types.USER_LOGOUT
  }
}
