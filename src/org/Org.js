import React, { Component } from 'react';
import { util } from 'givebox-lib';

class Org extends Component {

  componentWillUnmount() {
  }

  render() {

    return (
      <div className='flexCenter'>
        Organization Page {this.props.id}
      </div>
    )
  }
}

export default Org;
