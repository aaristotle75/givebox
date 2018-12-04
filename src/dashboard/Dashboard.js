import React, { Component } from 'react';
import { AppContext } from 'App';

export default class Dashboard extends Component {

  render() {

    return (
      <AppContext.Consumer>
      {(context) => (
        <div>
          <h2>Dashboard</h2>
          {context.user.fullName}
        </div>
      )}
      </AppContext.Consumer>
    )
  }
}
