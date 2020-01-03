import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  selectOptions,
  ModalLink,
  Form,
  Fade
} from 'givebox-lib';
import has from 'has';
import Moment from 'moment';

class PaymentFormClass extends Component {

  constructor(props) {
    super(props);
    this.renderFields = this.renderFields.bind(this);
    this.customOnChange = this.customOnChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
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

  customOnChange(name, value) {
    console.log('customOnChange', name, value);
    //this.props.fieldProp(name, { value });
  }

  renderFields() {

    const {
      customPlaceholder,
      sendEmail,
      breakpoint,
      phone,
      address,
      work,
      custom
    } = this.props;

    const name = this.props.textField('name', { placeholder: 'Enter Name',  label: 'Name', required: true });
    const creditCard = this.props.creditCardGroup({ required: true, placeholder: 'xxxx xxxx xxxx xxxx', debug: false});
    const email = this.props.textField('email', {required: true, placeholder: 'Enter Email Address', label: 'Email', validate: 'email', inputMode: 'email' });
    const phoneField = this.props.textField('phone', {required: phone.required, placeholder: 'Enter Phone Number', validate: 'phone', inputMode: 'tel' });
    const addressField = this.props.textField('address', { required: address.required, label: 'Address', placeholder: 'Enter Street Address' });
    const city = this.props.textField('city', { required: address.required, label: 'City', placeholder: 'Enter City' });
    const zip = this.props.textField('zip', { required: true, label: 'Zip Code', placeholder: 'Enter Zip Code', maxLength: 5, inputMode: 'numeric' });
    const state = this.props.dropdown('state', {label: 'State', fixedLabel: false, selectLabel: 'Enter State', options: selectOptions.states, required: address.required })
    const employer = this.props.textField('employer', { required: work.required, label: 'Employer', placeholder: 'Employer' });
    const occupation = this.props.textField('occupation', { required: work.required, label: 'Occupation', placeholder: 'Occupation' });
    const customField = this.props.textField('note', { required: custom.required, hideLabel: true, placeholder: 'Custom Note' });

    const cityStateZipGroup =
      <div>
        <div className='column' style={{ width: '40%' }}>{city}</div>
        <div className='column' style={{ width: '40%' }}>{state}</div>
        <div className='column' style={{ width: '20%' }}>{zip}</div>
      </div>
    ;

    const fields = [
      { name: 'name', field: name, enabled: true, order: 1 },
      { name: 'creditCard', field: creditCard, enabled: true, order: breakpoint === 'mobile' ? 0 : 2 },
      { name: 'email', field: email, enabled: true, order: 3 },
      { name: 'phone', field: phoneField, enabled: phone.enabled, order: 4 },
      { name: 'address', field: addressField, enabled: address.enabled, order: 5 },
      { name: 'zip', field: address.enabled ? cityStateZipGroup : zip, enabled: true, order: 6 },
      { name: 'employer', field: employer, enabled: work.enabled, order: 7 },
      { name: 'occupation', field: occupation, enabled: work.enabled, order: 8 },
      { name: 'custom', field: customField, enabled: custom.enabled, order: 9, width: '100%' }
    ];

    util.sortByField(fields, 'order', 'ASC');

    const items = [];
    Object.entries(fields).forEach(([key, value]) => {
      if (value.enabled) {
        items.push(
          <div
            key={key}
            className='column'
            style={{ width: this.props.breakpoint === 'mobile' ? '100%' : util.getValue(value, 'width', '50%') }}
          >
            {value.field}
          </div>
        );
      }
    });

    return items;
  }

  render() {

    return (
      <div className='gbxPaymentForm'>
        <h2>{this.props.breakpoint}</h2>
        {this.renderFields()}
        {this.props.saveButton(this.processForm, { style: { margin: 0, padding: 0, height: 0, width: 0, visibility: 'hidden' } })}
      </div>
    )
  }
}

PaymentFormClass.defaultProps = {
  customField: false,
  customPlaceholder: 'Custom Field',
  sendEmail: false
}

function mapStateToProps(state, props) {
  return {
  }
}

const PaymentFormConnect = connect(mapStateToProps, {
})(PaymentFormClass)


class PaymentForm extends Component {

	constructor(props){
		super(props);
    this.handleResize = this.handleResize.bind(this);
    this.formStateCallback = this.formStateCallback.bind(this);
    this.state = {
      windowWidthChange: window.innerWidth,
      breakpoint: window.innerWidth > props.breakpointSize ? 'desktop' : 'mobile',
      formState: {}
    }
    this._isMounted = false;
	}

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  handleResize(e) {
    if (this._isMounted) {
      this.setState({
        windowWidthChange: window.innerWidth
      });
      const breakpoint = window.innerWidth > this.props.breakpointSize ? 'desktop' : 'mobile';
      if (breakpoint !== this.state.breakpoint) {
        this.setState({ breakpoint });
      }
    }
  }

  formStateCallback(formState) {
    this.setState({ formState });
  }

  render() {

    const {
      windowWidthChange,
      breakpoint,
      formState
    } = this.state;

    return (
      <div className='modalFormContainer'>
        <h2>{windowWidthChange}</h2>
        <Fade
          in={util.getValue(formState, 'error', false)}
          duration={100}
        >
          <div className='error'>Error Occurred</div>
        </Fade>
        <Form
          id='gbxForm'
          name={'gbxForm'}
          errorMsg={false}
          successMsg={false}
          formPropCallback={this.formStateCallback}
        >
          <PaymentFormConnect
            {...this.props}
            breakpoint={breakpoint}
          />
        </Form>
      </div>
    )
  }
}

PaymentForm.defaultProps = {
  breakpointSize: 800,
  phone: {
    enabled: false,
    required: false
  },
  address: {
    enabled: false,
    required: false
  },
  work: {
    enabled: false,
    required: false
  },
  custom: {
    enabled: false,
    required: false
  }
}

export default PaymentForm;
