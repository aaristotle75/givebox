import React, { Component } from 'react';

export default class SubHeader extends Component {

  render() {

    return (
      <header className='subNav'>
        <div className='container'>
          {this.props.children}
        </div>
      </header>
    )
  }
}
