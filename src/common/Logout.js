import React, {Component} from 'react';

export default class Logout extends Component {

  render() {

    return (
      <div className='center'>
        <h3>Please confirm you want to logout?</h3>
        <div className='button-group'>
          <button className="button" type="button" onClick={this.props.logout}>Yes, logout</button>
        </div>
      </div>
    )
  }
}
