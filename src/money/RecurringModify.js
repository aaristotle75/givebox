import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  sendResource,
  getResource,
  toggleModal
} from 'givebox-lib';

class RecurringModifyConnect extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  formSavedCallback() {
    console.log('formSavedCallback', this.props.responseData);
    this.props.toggleModal('recurringModify', false);
    return;
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(this.formSavedCallback, `Recurring order has been updated.`);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  processForm(fields) {
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });
    const resource = this.props.id ? 'userRecurringOrder' : 'userRecurringOrders';
    const method = this.props.id ? 'patch' : 'post';
    if (!this.props.id) {
      data.itemID = this.props.purchaseID;
    }
    data.advanceNext = true;
    this.props.sendResource(
      resource,
      {
        id: [this.props.id],
        method: method,
        data: data,
        callback: this.processCallback.bind(this),
        resourcesToLoad: this.props.resourcesToLoad
      });
  }
  render() {

    const {
      desc,
      interval,
      id
    } = this.props;

    const options = id ?
      [
        { primaryText: 'Cancel', value: 'once' },
        { primaryText: 'Daily', value: 'daily' },
        { primaryText: 'Monthly', value: 'monthly' },
        { primaryText: 'Quarterly', value: 'quarterly' },
        { primaryText: 'Yearly', value: 'annually' }
      ]
    :
      [
        { primaryText: 'Daily', value: 'daily' },
        { primaryText: 'Monthly', value: 'monthly' },
        { primaryText: 'Quarterly', value: 'quarterly' },
        { primaryText: 'Yearly', value: 'annually' }
      ]
    ;

    return (
      <div className='modalFormContainer center'>
        <h3 style={{marginBottom: 0}}>{`${id ? `To modify the recurring order please change the interval for ${desc}` : `To make a recurring order set an interval for ${desc}`}`}.</h3>
        {this.props.dropdown('interval', {
          options: options,
          value: interval,
          required: true,
          className: 'column50',
          contentStyle: { maxHeight: 150 },
        })}
        <div className='button-group'>
          {this.props.saveButton(this.processForm, { label: id ? `Update` : `Save` })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

const RecurringModifyForm = connect(mapStateToProps, {
  sendResource,
  getResource,
  toggleModal
})(RecurringModifyConnect)


const RecurringCreate = (props) => {
  return (
    <div className='modalFormContainer center'>
      <h2 style={{marginBottom: 0}} className='center'>{props.id ? 'Modify' : 'Make'} Recurring Order</h2>
      <Form name={'userRecurringOrder'}>
        <RecurringModifyForm {...props} name={props.resource} />
      </Form>
    </div>
  )
}

export default RecurringCreate;
