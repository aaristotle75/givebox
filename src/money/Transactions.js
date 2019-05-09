import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  reloadResource,
  util,
  Table,
  Search,
  ModalLink,
  ActionsMenu,
  Export,
  Filter,
  _v,
  Collapse,
  Image,
  types
} from 'givebox-lib';
import Header from 'common/Header';
import has from 'has';

class Transactions extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.resourceName, { search: { sort: 'updatedAt' }, reload: true });
  }

  formatTableData() {
    const {
      items
    } = this.props;

    const data = items.data;
    const fdata = {};
    const headers = [];
    const rows = [];
    const item = {
      desc: [],
      details: [],
      credit: (0).toFixed(2),
      options: {}
    };
    // lastName%2CfirstName

    headers.push(
      { name: 'Transactions', colspan: 2, width: '65%', sort: 'createdAt' },
      { name: 'Amount', width: '20%', sort: 'amount' },
      { name:
        <Export
          name={this.props.resourceName}
          align={'right'}
          desc={<span><span className='exportRecordsText'>Download Report</span> <span className='icon icon-download-cloud'></span></span>}
        />, width: '15%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(data)) {
      data.forEach(function(value, key) {
        const credit = formatCreditData(value);
        item.desc = credit.desc;
        item.details = credit.details;
        item.credit = credit.credit;
        item.options = credit.options;
        const sendDesc = `${value.cusEmail}`;

        // Actions Menu Options
        const options = [];
        options.push(
          <ModalLink id='sendReceipt' className='button' opts={{ id: value.ID, desc: sendDesc }}>Send Receipt</ModalLink>
        );

        rows.push([
          { details: credit.details, width: '7%', key: key },
          { value: credit.desc, primary: true },
          { value: util.money(credit.credit) },
          { actions:
          <ActionsMenu
            options={options}
          />
          }
        ]);
      });
    }
    fdata.rows = rows;

    return fdata;
  }

  render() {

    const {
      resourceName,
      routeProps,
      loader,
      isFetching,
      meta
    } = this.props;

    const filters = [
      { field: 'calendarRange', name: 'createdAt' }
    ];

    const totalStats = has(meta, 'totalStats') ? util.getValue(meta.totalStats, 'netTotal', 0) : 0;
    const balance = util.numberWithCommas(parseFloat(totalStats/100).toFixed(2)).split('.');
    let dollarAmount = <span className='dollarAmount'>{balance[0]}</span>;
    let centAmount = balance[1];
    if (balance[0].includes(',')) {
      let dollarArr = balance[0].split(',');
      dollarAmount = <span className='dollarAmount'>{dollarArr[0]}<span className='dollarComma'>,</span>{dollarArr[1]}</span>
    }

    return (
      <div className='money'>
        <Header loader={loader} location={routeProps.location} history={routeProps.history} >
          <div className='subNavContent'>
            <div className='flexBetween'>
              <div className='leftSide'>
                <Image maxSize={'125px'} url={`https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/settings-money.png`} size='inherit' alt={`Transactions`} />
                <div className='balance'>
                  <h1><span className='moneyAmount'><span className='symbol'>$</span>{dollarAmount}<span className='centAmount'><span className='centSymbol'>.</span>{centAmount}</span></span></h1>
                  <ModalLink id='financeGlossary' className='link glossary'>Transactions Total</ModalLink>
                </div>
                <ActionsMenu
                  label='Manage Money'
                  options={[
                    <ModalLink id='recurring' className='button'>Recurring Transactions</ModalLink>,
                    <ModalLink id='payMethods' className='button'>Pay Methods</ModalLink>
                  ]}
                />
              </div>
              <div className='right'>
                <div className='menu'>
                  <ModalLink style={{marginRight: 10}} id={`recurring`} className='buttonAnimation button secondary subHeader'>Recurring Transactions</ModalLink>
                  <ModalLink style={{marginRight: 10}} id={`payMethods`} className='buttonAnimation button secondary subHeader'>Pay Methods</ModalLink>
                </div>
                <div className='searchBlock'>
                  <Search
                    name={resourceName}
                  />
                </div>
              </div>
            </div>
            <Filter
              name={resourceName}
              options={filters}
              label='Advanced Search'
              allowDisabled={false}
            />
          </div>
        </Header>
        <div className='mainContent'>
          <div className='container'>
            {isFetching && this.props.loader(`Loading data`)}
            <Collapse
              label={`Transaction List`}
              iconPrimary='list'
            >
              <div className='sectionContainer'>
                <div className='section'>
                  <Table
                    name={resourceName}
                    data={() => this.formatTableData()}
                    nextIcon='icon-next'
                    previousIcon='icon-back'
                  />
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    )
  }
}

Transactions.defaultProps = {
  resourceName: 'userPurchases'
}

function mapStateToProps(state, props) {

  const items = state.resource.userPurchases ? state.resource.userPurchases : {};
  let filter = null;
  let query = null;
  if (has(items, 'search')) {
    filter = items.search.filter;
    query = items.search.query;
  }

  return {
    items: items,
    filter: filter,
    query: query,
    isFetching: has(items, 'isFetching') ? items.isFetching : false,
    meta: has(items, 'meta') ? items.meta : {}
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource
})(Transactions);


/**
* Set Description, Details for Credits
* @param {object} data
*/
export const formatCreditData = (data, customerTransaction = false) => {
  const item = {
    desc: [],
    details: [],
    credit: (0).toFixed(2)
  };
  if (!util.isEmpty(data)) {
    const createdAt = util.getDate(data.createdAt, 'MM/DD/YYYY h:mmA');
    const updatedAt = util.getDate(data.updatedAt, 'MM/DD/YYYY h:mmA');
    const amountText = data.articleAccountType === 'donation' ? 'Donation' : 'Sale';
    let feeText = data.passFees ? 'You paid the bank fee' : `Nonprofit paid the bank fee`;
    let status = data.state.toUpperCase();
    let returnAmount, returnText;

    item.credit = util.calcAmount(data.amount, data.fee, data.passFees, true);

    switch (data.state) {
      case 'refunded': {
        feeText = data.freeRefund ? 'Transaction VOIDED' : 'Transaction Refunded';
        status = data.freeRefund ? 'VOIDED' : status;
        //item.credit = -Math.abs(util.calcAmount(data.amount, data.fee, data.passFees, data.freeRefund ? false : true));
        item.credit = -Math.abs(item.credit);
        returnAmount = util.money(util.calcAmount(data.amount, data.fee, data.passFees, true));
        returnText = data.freeRefund ? 'Voided' : 'Refunded';
        break;
      }

      case 'chargeback': {
        feeText = 'Bank fee debited from the Org';
        //item.credit = -Math.abs(util.calcAmount(data.amount, data.fee, data.passFees, true));
        item.credit = -Math.abs(parseFloat(data.fee/100).toFixed(2));
        returnAmount = util.money(util.calcAmount(data.amount, data.fee - 1500, data.passFees, true));
        returnText = 'Charged Back';
        break;
      }

      // no default
    }
    let desc =
      <div key={`credit-${data.ID}`} className='description'>
        <span className='line'>{data.articleTitle}</span>
        <span className='line date'>{data.articleOrgName}</span>
        <span className='line date'>{data.cardName || `${data.cusFirstName} ${data.cusLastName}`}<span className='txCardType'>{data.cardType ? `, ${data.cardType.toUpperCase()} ${data.cardLast4}` : ''}</span> <span className={`txState ${data.state}`}>{`${data.state !== 'approved' ? ` ${status}` : data.orderState === 'pending' ? ` ${data.orderState.toUpperCase()}` : ''}`}</span></span>
      </div>
    ;

    let commerceDesc = '';
    if (data.articleAccountType === 'commerce') commerceDesc = `${data.articleUnitDescription ? `${data.articleUnitDescription} x ` : ''}Qty ${data.articleUnitQuantity}`;

    item.desc.push(
      <span key={data.updatedAt}><span className='date' style={{display: 'block', paddingBottom: 3}}>{updatedAt}</span>{desc}<span className='descAmount' style={{fontWeight: 300}}>{util.money(item.credit)}</span></span>
    );

    item.details.push(
      <div key={`credit-${data.ID}-details`} className='description'>
        <div className='column50'>
          <span className='line superOnly'><span className='detailsLabel'>Transaction ID:</span>{data.transactionID}</span>
          <span className='line'><span className='detailsLabel'>Created:</span>{createdAt}</span>
          <span className='line'><span className='detailsLabel'>Email:</span>{data.cusEmail}</span>
          {data.cardName && <span className='line'><span className='detailsLabel'>Name on Card:</span>{data.cardName}</span>}
          <span className='line'><span className='detailsLabel'>Type:</span>{types.txAccount(data.articleAccountType)}</span>
          <span className='line'><span className='detailsLabel'>Nonprofit:</span>{data.articleOrgName}</span>
          <span className='line'><span className='detailsLabel'>{types.kind(data.articleKind).name}:</span>{data.articleTitle}</span>
          {commerceDesc && <span className='line'><span className='detailsLabel'>Purchased:</span>{commerceDesc} @ {util.money(parseFloat(data.articleUnitPrice/100).toFixed(2))} each</span>}
          {data.notePlaceholder && <span className='line'><span className='detailsLabel'>{data.notePlaceholder}:</span>{data.noteValue || 'N/A'}</span>}
        </div>
        <div className='column50 right'>
          <span className='line'><span className='detailsLabel'>Status:</span>{data.state === 'approved' ? data.orderState.toUpperCase() : status}</span>
          <span className='line'>{data.cardType.toUpperCase()}</span>
          {data.cardLast4 && <span className='line'>xxxxxxxxxxxx{data.cardLast4}</span>}
          <span className='line'><span className='detailsLabel'>{amountText}:</span>{util.money(util.calcAmount(data.amount, data.fee, data.passFees, data.passFees ? false : true))}</span>
          <span className='line'><span className='detailsLabel'>Bank Fee:</span>{data.state === 'approved' ? '*' : ''}{util.money(parseFloat(data.passFees ? data.fee/100 : 0/100).toFixed(2))}</span>
          <span className='line'><span className='detailsLabel'>Charged:</span>{util.money(util.calcAmount(data.amount, data.state === 'chargeback' ? data.fee - 1500 : data.fee, data.passFees, true))}</span>
          {returnAmount && <span className='line'><span className='detailsLabel'>{returnText}:</span>{returnAmount}</span>}
          <span style={{marginTop: 5}} className='link smallText'>*{feeText}</span>
        </div>
        <div className='clear'></div>
      </div>
    );
  }
  return item;
}
