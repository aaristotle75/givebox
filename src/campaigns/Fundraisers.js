import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  removeResource,
  Dropdown,
  types,
  ModalLink,
  ActionsMenu,
  Image,
  util,
  Table,
  Search,
  Collapse
} from 'givebox-lib';
import has from 'has';
import Header from 'common/Header';

class Fundraisers extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource('fundraisers', {
      search: {
        filter: `volunteerID:${this.props.userID}`
      },
      reload: true
    });
  }

  formatTableData(resource) {
    const fdata = {};
    const headers = [];
    const rows = [];
    //let footer = [];

    headers.push(
      { name: 'Description', colspan: 2, width: '45%', sort: 'title' },
      { name: 'Amount', width: '15%', sort: 'raised' },
      { name: 'Conversion', width: '10%', sort: 'conversion' },
      { name: '', width: '15%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(resource.data) && has(resource, 'data')) {
      resource.data.forEach(function(value, key) {
        let conversion = parseFloat((value.conversion)*100).toFixed(1) + '%';
        conversion = parseInt(conversion) > 100 ? parseFloat(100).toFixed(1) + '%' : conversion;
        const createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');
        const amount = util.money(value.raised/100);

        const campaign =
          <div className='description'>
            <span className='line'>{value.title}</span>
            <span className='line date'>Peer-2-Peer Fundraiser</span>
          </div>
        ;

        const details =
          <div className='description'>
            <div className='column33'>
              <div className='image'>
                { value.imageURL ? <img src={util.imageUrlWithStyle(value.imageURL, 'medium')} alt={value.title} /> :
                <div className='imagePlaceholder'><span className='icon icon-instagram'></span></div> }
                <ModalLink id={`share`} className='imageCover' opts={{ id: value.articleID, kind: 'fundraiser' }}><div className='imageLink'>Share</div></ModalLink>
              </div>
            </div>
            <div className='column33'>
              <span className='line'><span className='detailsLabel'>Created:</span>{createdAt}</span>
              <span className='line'><span className='detailsLabel'>Type: </span>Peer-2-Peer Fundraiser</span>
              <span className='line'><span className='detailsLabel'>Title: </span>{value.title}</span>
            </div>
            <div className='column33 right'>
              <span className='line'><span className='detailsLabel'>Amount:</span> {amount}</span>
              {conversion && <span className='line'><span className='detailsLabel'>Conversion:</span>{conversion}</span>}
              <span className='line'><span className='detailsLabel'>Average:</span>{util.money(value.avgPurchase/100)}</span>
              <span className='line'><span className='detailsLabel'>Transactions:</span>{value.purchases}</span>
              <span className='line'><span className='detailsLabel'>Visitors:</span>{value.visitors}</span>
            </div>
          </div>
        ;

        rows.push([
          { details: details, width: '6%', key: value.ID },
          { value: campaign, primary: true },
          { value: amount },
          { value: conversion },
          { actions:
            <div className='actionsMenu'><ModalLink className='menuLabel' id='share' style={{ textAlign: 'center' }} opts={{ id: value.articleID, kind: 'fundraiser'}}>Share</ModalLink></div>
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
      fundraisers,
      loader,
      routeProps,
      resourceName
    } = this.props;

    const balance = has(fundraisers, 'meta') ? util.getValue(fundraisers.meta, 'total', 0) : 0;

    return (
      <div className='money'>
        <Header loader={loader} location={routeProps.location} history={routeProps.history} >
          <div className='subNavContent'>
            <div className='flexBetween'>
              <div className='leftSide'>
                <Image maxSize={'125px'} url={`https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/raise-fundraiser.png`} size='inherit' alt={'Fundraisers'} />
                <div className='balance'>
                  <h1>{balance}</h1>
                  <ModalLink id='financeGlossary' className='link glossary'>Fundraisers you created</ModalLink>
                </div>
              </div>
              <div className='right'>
                <div className='menu'>
                </div>
                <div className='searchBlock'>
                  <Search
                    name={resourceName}
                  />
                </div>
              </div>
            </div>
          </div>
        </Header>
        <div className='mainContent'>
          <div className='container'>
            {this.props.isFetching && this.props.loader(`Loading data`)}
            <Collapse
              label={`Peer-2-Peer Fundraisers List`}
              iconPrimary='list'
            >
              <div className='sectionContainer'>
                <div className='section'>
                  <Table
                    name={resourceName}
                    data={() => this.formatTableData(fundraisers)}
                    exportDisplay='None'
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

function mapStateToProps(state, props) {

  const fundraisers = state.resource.fundraisers ? state.resource.fundraisers : {};

  return {
    fundraisers,
    resourceName: 'fundraisers',
    isFetching: has(fundraisers, 'isFetching') ? fundraisers.isFetching : false,
    userID: util.getValue(state.resource, 'userID', 0)
  }
}

export default connect(mapStateToProps, {
  getResource,
  removeResource
})(Fundraisers);
