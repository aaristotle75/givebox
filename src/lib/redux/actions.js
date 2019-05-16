import * as types from './actionTypes';
import has from 'has';

// Create any actions that interact with the redux store reducer

export function testAction() {
  return {
    type: types.TEST_ACTION
  }
}
