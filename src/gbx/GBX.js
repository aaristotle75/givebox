import React, { Component } from 'react';
import { util } from 'givebox-lib';

class GBX extends Component {

  componentWillUnmount() {
  }

  render() {

    return (
      <div className='flexCenter'>
        GBX Payment Form {this.props.id}
      </div>
    )
  }
}

export default GBX;
