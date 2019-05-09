import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendResource, toggleModal, Alert } from 'givebox-lib';

class SendReceipt extends Component {

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.confirmCallback = this.confirmCallback.bind(this);
    this.state = {
      success: ''
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  confirmCallback(res, err) {
    if (!err) {
      this.setState({ success: 'Receipt sent.' });
      this.timeout = setTimeout(() => {
        this.props.toggleModal('sendReceipt', false);
        this.timeout = null;
      }, 2000);
    }
  }

  confirm() {
    this.props.sendResource(
      'purchaseReceipt', {
        id: [this.props.id],
        method: 'put',
        callback: this.confirmCallback
      });
  }

  render() {

    const {
      desc
    } = this.props;

    return (
      <div className='modalFormContainer center'>
        <Alert alert='success' display={this.state.success} msg={this.state.success} />
        <h3>Please confirm you want to resend the email receipt to {desc}.</h3>
        <div className='button-group'>
          <button className="button" type="button" onClick={this.confirm}>Send Receipt</button>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  sendResource,
  toggleModal
})(SendReceipt)
