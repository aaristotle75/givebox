import * as types from './actionTypes';
import has from 'has';

// Create any actions that interact with the redux store reducer

export function userLogout() {
  return {
    type: types.USER_LOGOUT
  }
}

export function toggleLeftMenu(open) {
  return {
    type: open ? types.OPEN_LEFT_MENU : types.CLOSE_LEFT_MENU
  }
}

export function setCloudParam(key, value) {
  return {
    type: types.SET_CLOUD_PARAM,
    key: key,
    value: value
  }
}

/*
* Cloud Status depending on underwriting status, legal entity status, org status and risk status
* @param {string} status
*
* Status: 3 (trusted), 2 (approved), 1 (watching), 0 (not trusted or deactivated)
*
* 3 - org status active, underwriting approved, legal entity approved, no risk
* 2 - org status active, underwriting approved, legal entity approved, low risk
* 1 - org status active or pending, underwriting and/or legal entity not approved, or medium risk
* 0 - org status deactivated or suspended, underwriting and/or legal entity not approved, high risk
*
*/
export function setCloudStatus(status) {
  return {
    type: types.SET_STATUS,
    status: status
  }
}

export function setJustApproved(bool) {
  return {
    type: types.SET_JUST_APPROVED,
    justApproved: bool
  }
}
