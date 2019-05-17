import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util, selectOptions } from 'givebox-lib';
import has from 'has';

class Payment extends Component {

  constructor(props) {
    super(props);
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

  render() {

    const name = this.props.textField('name', { required: true, label: 'Name' });
    const creditCard = this.props.creditCardGroup({ required: true, debug: false});
    const address = this.props.textField('address', { required: false, label: 'Street Address' });
    const city = this.props.textField('city', { required: false, label: 'City' });
    const zip = this.props.textField('zip', { required: false, label: 'Zip' });
    const state = this.props.dropdown('state', {label: 'State', fixedLabel: false, options: selectOptions.states })
    const row1Cols = [
      {
        width: '50%',
        field: name
      },
      { width: '50%',
        field: creditCard
      }
    ];

    const row2Cols = [
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
    ];

    return (
      <div className='gbxPaymentForm'>
        <Row cols={row1Cols} />
        <Row cols={row2Cols} />
      </div>
    )
  }
}

Payment.defaultProps = {
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
