import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  selectOptions,
  ModalLink,
  Form
} from 'givebox-lib';
import has from 'has';
import Moment from 'moment';

class PaymentFormClass extends Component {

  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
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

  renderRows() {

    const {
      customField,
      customPlaceholder,
      sendEmail
    } = this.props;

    const name = this.props.textField('name', { placeholder: 'Your Name',  label: 'Name', required: true });
    const creditCard = this.props.creditCardGroup({ required: true, hideLabel: true, placeholder: 'Enter Credit Card', debug: false});
    const email = this.props.textField('email', {required: true, placeholder: 'Your Email Address', label: 'Email', validate: 'email', inputmode: 'email' });
    const phone = this.props.textField('phone', {placeholder: 'Phone Number', validate: 'phone', inputmode: 'tel' });
    const address = this.props.textField('address', { required: false, label: 'Address', placeholder: 'Address' });
    const city = this.props.textField('city', { required: false, label: 'City', placeholder: 'City' });
    const zip = this.props.textField('zip', { required: false, label: 'Zip', placeholder: 'Zip', maxLength: 5, inputmode: 'numeric' });
    const state = this.props.dropdown('state', {label: 'State', fixedLabel: false, selectLabel: 'State', options: selectOptions.states })
    const employer = this.props.textField('employer', { required: false, label: 'Employer', placeholder: 'Employer' });
    const occupation = this.props.textField('occupation', { required: false, label: 'Occupation', placeholder: 'Occupation' });
    const custom = this.props.textField('note', { required: false, hideLabel: true, placeholder: 'Custom Note' });

    const cityStateZipGroup =
      <div>
        <div className='column' style={{ width: '40%' }}>{city}</div>
        <div className='column' style={{ width: '40%' }}>{state}</div>
        <div className='column' style={{ width: '20%' }}>{zip}</div>
      </div>
    ;

    const rowCols = [];
    rowCols.push([
      {
        width: '50%',
        field: name
      },
      { width: '50%',
        field: creditCard
      }
    ]);

    rowCols.push([
      {
        width: '50%',
        field: email
      },
      { width: '50%',
        field: phone
      }
    ]);

    rowCols.push([
      {
        width: '50%',
        field: address
      },
      { width: '50%',
        field: cityStateZipGroup
      },
    ]);

    rowCols.push([
      {
        width: '50%',
        field: occupation
      },
      { width: '50%',
        field: employer
      }
    ]);

    rowCols.push([
      {
        width: '50%',
        field: custom
      },
      { width: '50%',
        field: <ModalLink id='sendEmail' opts={{ customOnChange: this.customOnChange, props: this.props }}>Send Email</ModalLink>
      }
    ]);

    const rows = [];
    if (!util.isEmpty(rowCols)) {
      Object.entries(rowCols).forEach(([key, value]) => {
        rows.push(
          <Row breakpoint={this.props.breakpoint} key={key} cols={value} />
        );
      });
    }

    return rows;
  }

  render() {

    return (
      <div className='gbxPaymentForm'>
        <h2>{this.props.breakpoint}</h2>
        {this.renderRows()}
        <div className='column center'>{this.props.saveButton(this.processForm, { style: { width: 150 } })}</div>
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
    this.state = {
      windowWidthChange: window.innerWidth,
      breakpoint: window.innerWidth > props.breakpointSize ? 'desktop' : 'mobile'
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

  render() {

    const {
      windowWidthChange,
      breakpoint
    } = this.state;

    return (
      <div className='modalFormContainer'>
        <h2>{windowWidthChange}</h2>
        <Form id='gbxForm' name={'gbxForm'}>
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
  breakpointSize: 800
}

export default PaymentForm;

/**
* Display Form Row
*
* @param {string} resource Name of resource
* @param {array} cols an array of objects containing column info
*
* // Cols {object} //
* @param {string} width of the column
* @param {function} field form field
*/
export const Row = ({ breakpoint, cols = [] }) => {
  const columns = [];
  if (!util.isEmpty(cols)) {
    Object.entries(cols).forEach(([key, value]) => {
      columns.push(
        <div
          key={key}
          className='column'
          style={{ width: breakpoint === 'mobile' ? '100%' : value.width }}
        >
          {value.field}
        </div>
      );
    });
  }
  return (
    <div className='row'>
      {columns}
    </div>
  )
}
