import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  selectOptions,
  ModalLink,
  ModalRoute
} from 'givebox-lib';
import has from 'has';

class Payment extends Component {

  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
    this.customOnChange = this.customOnChange.bind(this);
    this.state = {
      loading: false
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
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
    const email = this.props.textField('email', {required: true, placeholder: 'Your Email Address', label: 'Email', validate: 'email'});
    const phone = this.props.textField('phone', {placeholder: 'Phone Number', validate: 'phone'});
    const address = this.props.textField('address', { required: false, label: 'Address', placeholder: 'Address' });
    const city = this.props.textField('city', { required: false, label: 'City', placeholder: 'City' });
    const zip = this.props.textField('zip', { required: false, label: 'Zip', placeholder: 'Zip' });
    const state = this.props.dropdown('state', {label: 'State', fixedLabel: false, selectLabel: 'State', options: selectOptions.states })
    const employer = this.props.textField('employer', { required: false, label: 'Employer', placeholder: 'Employer' });
    const occupation = this.props.textField('occupation', { required: false, label: 'Occupation', placeholder: 'Occupation' });
    const custom = this.props.textField('note', { required: false, hideLabel: true, placeholder: 'Custom Note' });


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
      { width: '20%',
        field: city
      },
      {
        width: '20%',
        field: state
      },
      {
        width: '10%',
        field: zip
      }
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
          <Row key={key} cols={value} />
        );
      });
    }

    return rows;
  }

  render() {

    return (
      <div className='gbxPaymentForm'>
        {this.props.textField('recipients', { type: 'hidden' })}
        {this.props.textField('message', { type: 'hidden' })}
        {this.renderRows()}
      </div>
    )
  }
}

Payment.defaultProps = {
  customField: false,
  customPlaceholder: 'Custom Field',
  sendEmail: false
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(Payment)


/**
* GET a resource from the API
*
* @param {string} resource Name of resource
* @param {array} cols an array of objects containing column info
*
* // Cols {object} //
* @param {string} width of the column
* @param {function} field form field
*/
export const Row = ({ cols = [] }) => {
  const columns = [];
  if (!util.isEmpty(cols)) {
    Object.entries(cols).forEach(([key, value]) => {
      columns.push(
        <div
          key={key}
          className='column'
          style={{ width: value.width }}
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
