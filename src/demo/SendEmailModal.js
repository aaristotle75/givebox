import React, { Component } from 'react';
import { SendEmail } from '../lib';

class SendEmailModal extends Component {

  componentWillUnmount() {
  }

  render() {

    return (
      <SendEmail {...this.props  } />
    )
  }
}

export default SendEmailModal;
