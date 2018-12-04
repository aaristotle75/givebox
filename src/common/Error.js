import React, { Component } from 'react';

class Error extends Component {

  componentWillUnmount() {
  }

  render() {

    return (
      <div>
        <h4 className='center' style={{marginTop: '30%'}}><span className='icon icon-error-circle'></span> 404 Not Found - We apologize but the url you are trying to access does not exist.</h4>
        <div style={{margin: '20px 0'}} className='row center'>
        </div>
      </div>
    )
  }
}

export default Error;
