import React, { Component } from 'react';
import {
  util,
  getResource
} from 'givebox-lib';
import { connect } from 'react-redux';

class Gateway extends Component {

  constructor(props) {
    super(props);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.initResources = this.initResources.bind(this);
    this.state = {
      loading: true,
      id: null,
      template: null
    }
  }

  componentDidMount() {
    const params = this.props.routeProps.match.params;
    const id = util.getValue(params, 'id', 0);
    this.setState({ id, template: 'article'}, this.initResources);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  initResources() {
    switch (this.state.template) {
      case 'article': {
        this.props.getResource('article', {
          id: [this.state.id],
          callback: (res, err) => {
            console.log('execute', res, res.orgID);
            this.props.getResource('org', {
              id: [res.orgID]
            });
          }
        });
        break;
      }

      case 'org': {
        this.props.getResource('org', {
          id: [this.state.orgID]
        });
        break;
      }

      // no default
    }
  }

  renderDisplay() {
    return this.props.loadComponent('gbx/GBX', {
      routeProps: this.props.routeProps,
      props: {
        id: this.state.id,
        org: this.props.org
      }
    });
  }

  render() {

    const {
      org
    } = this.props;

    if (util.isLoading(org)) return this.props.loader('Loading org...');

    return this.renderDisplay()
  }
}

function mapStateToProps(state) {
  return {
    article: state.resource.article ? state.resource.article : null,
    org: state.resource.org ? state.resource.org : {},
  }
}

export default connect(mapStateToProps, {
  getResource
})(Gateway)
