import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  util,
  Table,
  ModalLink,
  Search,
  types,
  Image,
  Collapse
} from 'givebox-lib';
import has from 'has';

class Recurring extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.resourceName, { search: { filter: 'interval:!"once"', query: this.props.query } , reload: true });
  }

  formatTableData(resource) {

    const fdata = {};
    const headers = [];
    const rows = [];
    //let footer = [];

    headers.push(
      { name: '*details', width: '5%', sort: '' },
      { name: 'Description', width: '30%', sort: 'cusEmail' },
      { name: 'Amount', width: '15%', sort: 'amount' },
      { name: 'Interval', width: '15%', sort: 'interval' },
      { name: 'Next', width: '15%', sort: 'nextDonationAt' },
      { name: '', width: '15%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(resource.data) && has(resource, 'data')) {
      resource.data.forEach(function(value, key) {
        const createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');
        const amount = util.money(parseFloat(value.amount/100).toFixed(2));
        const next = value.nextDonationAt ? util.getDate(value.nextDonationAt, 'MM/DD/YYYY') : '';
        const interval = value.interval === 'annually' ? 'yearly' : value.interval;

        const details =
          <div className='description'>
            <div className='column50'>
              <span className='line'><span className='detailsLabel'>Created on:</span>{createdAt}</span>
              {value.cusFirstName && <span className='line'><span className='detailsLabel'>Customer:</span>{`${value.cusFirstName} ${value.cusLastName}`}</span>}
              <span className='line'><span className='detailsLabel'>Customer Email:</span>{value.cusEmail}</span>
              {value.cardName && <span className='line'><span className='detailsLabel'>Name on Card:</span>{value.cardName}</span>}
              <span className='line'><span className='detailsLabel'>{types.kind(value.articleKind).name}:</span>{value.articleTitle.toUpperCase()}</span>
            </div>
            <div className='column50 right'>
              <span className='line'><span className='detailsLabel'>Recurring Amount:</span>{amount}</span>
              <span className='line'><span className='detailsLabel'>Interval:</span>{util.toTitleCase(interval)}</span>
              {next && <span className='line'><span className='detailsLabel'>Next Transaction:</span>{next}</span>}
            </div>
          </div>
        ;
        const order =
          <div className='description'>
            <span className='line date'>{createdAt}</span>
            <span className='line'>{value.cardName || `${value.cusFirstName} ${value.cusLastName}`}<span className='txCardType'>{value.cardType ? `, ${value.cardType.toUpperCase()} ${value.cardLast4}` : ''}</span>
            </span>
          </div>
        ;

        const desc = `${value.cardName || value.cusFirtName + ' ' + value.cusLastName} ${value.cardType ? value.cardType.toUpperCase() + ' ' + value.cardLast4 : ''}`;

        rows.push([
          { details: details, width: '6%', key: value.ID },
          { value: order, primary: true },
          { value: amount },
          { value: util.toTitleCase(interval) },
          { value: next },
          { actions:
            <div className='actionsMenu'><ModalLink className='menuLabel' id='recurringModify' style={{ textAlign: 'center' }} opts={{ id: value.ID, desc: desc, interval: value.interval, type: 'modify', resourcesToLoad: ['userRecurringOrders'] }}>Modify</ModalLink></div>
          }
        ]);
      });
    }
    fdata.rows = rows;

    /*
    footer.push(
      { name: <div style={{textAlign: 'right'}}>Totals</div>, colspan: 3 },
      { name: '$1,123.42', colspan: 1}
    );
    fdata.footer = footer;
    */
    return fdata;
  }


  render() {

    const {
      resourceName,
      orders
    } = this.props;

    /*
    if (util.isFetching(orders)) {
      return this.props.loader('Trying to load initial resources');
    }
    */

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <div className='center'>
          <h2 style={{ marginTop: 20 }}>Recurring Transactions</h2>
          <div className='column50' style={{marginBottom: 20 }}>
            <Search
              name={resourceName}
            />
          </div>
        </div>
        <Collapse
          iconPrimary={'list'}
          label={'Recurring Transactions'}
        >
          <div className='sectionContainer'>
            <div className='section'>
              <Table
                name={resourceName}
                data={() => this.formatTableData(orders)}
              />
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

Recurring.defaultProps = {
  resourceName: 'userRecurringOrders'
}

function mapStateToProps(state, props) {

  const orders = state.resource.userRecurringOrders ? state.resource.userRecurringOrders : {};
  let query = null;
  if (has(orders, 'search')) {
    query = orders.search.query;
  }
  const isFetching = has(orders, 'isFetching') ? orders.isFetching : false;

  return {
    orders: orders,
    query: query,
    isFetching
  }
}

export default connect(mapStateToProps, {
  getResource
})(Recurring);
