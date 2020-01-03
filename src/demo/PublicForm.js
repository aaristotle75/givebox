import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  sendResource,
  util,
  removeResource,
  Form,
  types,
  Collapse,
  toggleModal,
  GBLink
} from 'givebox-lib';
import Moment from 'moment';
import { PaymentForm } from '../lib';

class PublicForm extends Component {

  constructor(props) {
    super(props);
    this.saveButton = this.saveButton.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  saveButton() {
    const form = document.getElementById(`gbxForm-form-saveButton`);
    if (form) form.click();
  }

  render() {

    const {
      item
    } = this.props;

    /*
    if (util.isLoading(item, this.props.id)) {
      return this.props.loader(`trying to load resource`);
    }
    */

    return (
      <div className='mobileFriendly'>
        <PaymentForm
          {...this.props}
        />
        <GBLink className='button' onClick={() => this.saveButton()}>Submit Form</GBLink>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    item: state.resource[props.resource] ? state.resource[props.resource] : {}
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource,
  toggleModal
})(PublicForm)
