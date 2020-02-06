import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  sendResource,
  util,
  removeResource,
  toggleModal,
  setCustomProp,
  GBLink
} from 'givebox-lib';
import { PaymentForm, CustomBtn } from '../lib';

class PublicForm extends Component {

  constructor(props) {
    super(props);
    this.saveButton = this.saveButton.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getResource('article', {
      id: [4],
      reload: false,
      callback: (res, err) => {
        const givebox = util.getValue(res, 'givebox', {});
        const primaryColor = util.getValue(givebox, 'primaryColor');
        this.props.setCustomProp('primaryColor', primaryColor);
      }
    });
  }

  saveButton() {
    const form = document.getElementById(`gbxForm-form-saveButton`);
    if (form) form.click();

  }

  render() {

    if (util.isLoading(this.props.article) ||
      !this.props.primaryColor) {
      return this.props.loader(`trying to load article`);
    }

    const article = util.getValue(this.props.article, 'data', {});

    return (
      <div className='mobileFriendly'>
        <PaymentForm
          primaryColor={this.props.primaryColor}
          article={article}
          phone={{ enabled: true, required: false }}
          address={{ enabled: true, required: false }}
          work={{ enabled: true, required: false }}
          custom={{ enabled: true, required: false, placeholder: 'My custom note placeholder' }}
        />
        <div className='button-group'>
          <CustomBtn color={this.props.primaryColor} className='gbxBtn' onClick={() => this.saveButton()}>Submit Form</CustomBtn>
          <GBLink onClick={() => console.log('onclick callback')}>No, thanks</GBLink>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    primaryColor: util.getValue(state.custom, 'primaryColor'),
    article: util.getValue(state.resource, 'article', {})
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource,
  toggleModal,
  setCustomProp
})(PublicForm)
