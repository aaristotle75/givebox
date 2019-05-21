import React, { Component } from 'react';

class SendEmail extends Component {

  componentWillUnmount() {
  }

  render() {

    const {
      props
    } = this.props;

    console.log('execute', this.props);

    return (
      <div>
        <h3 className='center'>Send Email</h3>
        {props.textField('recipients', { label: 'Email Recipients', fixedLabel: true, placeholder: 'Add email addresses, separate multiple emails by commas', required: true, debug: true })}
        {props.richText('message', { required: false, label: 'Message to recipients', fixedLabel: true, placeholder: 'Please write something...', modal: false })}
      </div>
    )
  }
}

export default SendEmail;
