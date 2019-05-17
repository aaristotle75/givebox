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
  toggleModal
} from 'givebox-lib';
import Moment from 'moment';
import { Payment } from '../lib';

class PaymentFormClass extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
  }

  componentDidMount() {
  }

  formSavedCallback() {
    if (this.props.callback) {
      this.props.callback(arguments[0]);
    }
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(() => this.formSavedCallback(res.ID));
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  processForm(fields) {
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
      if (key === 'name') {
    		const name = util.splitName(value.value);
    		data.firstname = name.first;
    		data.lastname = name.last;
      }
      if (key === 'ccnumber') data.number = value.apiValue;
      if (key === 'ccexpire') {
        const ccexpire = util.getSplitStr(value.value, '/', 2, -1);
        data.expMonth = parseInt(ccexpire[0]);
        data.expYear = parseInt(`${Moment().format('YYYY').slice(0, 2)}${ccexpire[1]}`);
      }
    });

    console.log('processForm', data);
    /*
    this.props.sendResource(
      this.props.resource,
      {
        id: [this.props.id],
        method: 'patch',
        data: data,
        callback: this.processCallback.bind(this),
      });
    */
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
      <div>
        <Payment {...this.props} />
        <div className='column center'>{this.props.saveButton(this.processForm, { style: { width: 150 } })}</div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    item: state.resource[props.resource] ? state.resource[props.resource] : {}
  }
}

const PaymentFormConnect = connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource,
  toggleModal
})(PaymentFormClass)


const PaymentForm = (props) => {
  return (
    <div className='modalFormContainer'>
      <Form name={'bankForm'}>
        <PaymentFormConnect {...props} resource={props.resource} />
      </Form>
    </div>
  )
}

export default PaymentForm;
