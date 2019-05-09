import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  util,
  Table,
  ModalLink,
  Search,
  Collapse,
  ActionsMenu
} from 'givebox-lib';
import has from 'has';

class PayMethod extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.resourceName, { search: { sort: 'createdAt%2CisDefault' } , reload: true });
  }

  formatTableData(resource) {

    const fdata = {};
    const headers = [];
    const rows = [];
    //let footer = [];

    headers.push(
      { name: '*details', width: '5%', sort: '' },
      { name: 'Pay Method', width: '60%', sort: 'createdAt' },
      { name: 'Default', width: '20%', sort: 'isDefault' },
      { name: '', width: '15%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(resource.data) && has(resource, 'data')) {
      resource.data.forEach(function(value, key) {
        const createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');

        const details =
          <div className='description'>
            <div className='column50'>
              <span className='line'><span className='detailsLabel'>Created on:</span>{createdAt}</span>
              <span className='line'><span className='detailsLabel'>Name on Card:</span>{value.name}</span>
              <span className='line'><span className='detailsLabel'>Billing Zip:</span>{value.zip}</span>
            </div>
            <div className='column50 right'>
              <span className='line'><span className='detailsLabel'>Default Pay Method:</span>{value.isDefault ? 'Yes' : 'No'}</span>
              <span className='line'><span className='detailsLabel'>Card Type:</span>{value.type.toUpperCase()}</span>
              <span className='line'><span className='detailsLabel'>Card Number:</span>xxxx xxxx xxxx {value.last4}</span>
              <span className='line'><span className='detailsLabel'>Expiration:</span>{value.expMonth}/{value.expYear}</span>
            </div>
          </div>
        ;
        const method =
          <div className='description'>
            <span className='line date'>{createdAt}</span>
            <span className='line'>{value.name}<span className='txCardType'>{value.type ? `, ${value.type.toUpperCase()} ${value.last4}` : ''}</span>
            </span>
          </div>
        ;

        const options = [];
        options.push(
          <ModalLink id='payMethodForm' className='button' opts={{ id: value.ID, method: value, resourcesToLoad: ['userPaymethods'] }}>Edit</ModalLink>
        );

        const deleteDesc = `${value.name}, ${value.type.toUpperCase()} ${value.last4}`;
        options.push(
          <ModalLink className='button' id={'delete'} opts={{ id: value.ID, resource: `userPaymethod`, desc: deleteDesc, modalID: 'delete', resourcesToLoad: ['userPaymethods'] }}> Delete</ModalLink>
        );

        rows.push([
          { details: details, width: '6%', key: value.ID },
          { value: method, primary: true },
          { value: value.isDefault ? <span className='green icon icon-check'></span> : ''},
          { actions:
            <ActionsMenu
              options={options}
            />
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
      items
    } = this.props;

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <h2 className='center' style={{ marginTop: 20 }}>Pay Methods</h2>
        <div className='flexCenter centerItems'>
          <ModalLink className='button' id={'payMethodForm'} opts={{ id: null, method: null }}>Add Pay Method</ModalLink>
          {/*
          <div className='column50' style={{marginBottom: 20 }}>
            <Search
              name={resourceName}
            />
          </div>
          */}
        </div>
        <Collapse
          iconPrimary={'list'}
          label={'Pay Method List'}
        >
          <div className='sectionContainer'>
            <div className='section'>
              <Table
                name={resourceName}
                data={() => this.formatTableData(items)}
              />
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

PayMethod.defaultProps = {
  resourceName: 'userPaymethods'
}

function mapStateToProps(state, props) {

  const items = state.resource.userPaymethods ? state.resource.userPaymethods : {};
  let query = null;
  if (has(items, 'search')) {
    query = items.search.query;
  }
  const isFetching = has(items, 'isFetching') ? items.isFetching : false;

  return {
    items: items,
    query: query,
    isFetching
  }
}

export default connect(mapStateToProps, {
  getResource
})(PayMethod);
