import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  sendResource,
  removeResource,
  getResource,
  toggleModal,
  Collapse,
  util
} from 'givebox-lib';
import Moment from 'moment';

class PayMethodFormConnect extends Component {

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
    this.props.toggleModal('payMethodForm', false);
    return;
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(this.formSavedCallback, `Pay method has been updated.`);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  processForm(fields) {
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
      if (key === 'ccnumber') data.number = value.apiValue;
      if (key === 'ccexpire') {
        const ccexpire = util.getSplitStr(value.value, '/', 2, -1);
        data.expMonth = parseInt(ccexpire[0]);
        data.expYear = parseInt(`${Moment().format('YYYY').slice(0, 2)}${ccexpire[1]}`);
      }
    });
    const resource = this.props.id ? 'userPaymethod' : 'userPaymethods';
    const method = this.props.id ? 'patch' : 'post';

    this.props.sendResource(
      resource,
      {
        id: this.props.id ? [this.props.id] : null,
        method: method,
        data: data,
        callback: this.processCallback.bind(this),
        resourcesToLoad: ['userPaymethods']
      });
  }
  render() {

    const {
      id,
      method
    } = this.props;

    const item = method || {};
    let ccexpireValue = '';
    let ccnumberValue = 'xxxx xxxx xxxx xxxx';
    if (!util.isEmpty(item)) {
      ccnumberValue = `xxxx xxxx xxxx ${util.getValue(item, 'last4')}`;
      ccexpireValue = `${util.getValue(item, 'expMonth')}/${util.getValue(item, 'expYear').toString().slice(2)}`;
    }

    return (
      <div>
        <h2 className='center'>{!this.props.id ? 'New' : 'Edit'} Pay Method</h2>
        <Collapse
          iconPrimary={'info'}
          label={'Credit Card Info'}
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <div className='row'>
                <div className='column66'>
                  {this.props.textField('name', { placeholder: 'Enter name on card', label: 'Name on Card', required: true, value: util.getValue(item, 'name') })}
                </div>
                <div className='column33'>
                  {this.props.textField('zip', { placeholder: 'Enter billing zip', label: 'Billing Zip Code', required: true, maxLength: 5, value: util.getValue(item, 'zip') })}
                </div>
              </div>
              {this.props.creditCardGroup({ readOnly: id ? true : false, placeholder: ccnumberValue, ccexpireValue: ccexpireValue, required: id ? false : true, debug: false})}
              {this.props.choice('isDefault', { label: 'Default Pay Method', checked: util.getValue(item, 'isDefault', false), value: util.getValue(item, 'isDefault', false) })}
            </div>
          </div>
        </Collapse>
        <div className='button-group center'>
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

const PayMethodFormClass = connect(mapStateToProps, {
  removeResource,
  sendResource,
  getResource,
  toggleModal
})(PayMethodFormConnect)


const PayMethodForm = (props) => {
  return (
    <div>
      <Form name={'userPaymethod'}>
        <PayMethodFormClass {...props} />
      </Form>
    </div>
  )
}

export default PayMethodForm;
