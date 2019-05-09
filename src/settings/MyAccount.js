import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  removeResource,
  sendResource,
  util,
  ModalLink,
  Image,
  Form,
  _v,
  Collapse
} from 'givebox-lib';
import Header from 'common/Header';
import has from 'has';

class MyAccountForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.state = {
      display: {
        primary: true,
        details: false
      },
    }
  }

  componentDidMount() {
    this.props.getResource(this.props.resource);
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
    return;
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
    util.toTop('layout-main');
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });

    this.props.sendResource(
      this.props.resource,
      {
        method: 'patch',
        data: data,
        callback: this.processCallback.bind(this)
      });
  }

  render() {

    const {
      item,
      userID
    } = this.props;

    if (util.isLoading(item, userID)) {
      return this.props.loader(`trying to load resource`);
    }
    const data = item.data || {};

    return (
      <div>
        <Collapse
          iconPrimary={'info'}
          label={'My Profile Details'}
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <div className='flexCenter'>
                {this.props.uploadField('imageURL', { value: util.getValue(data, 'imageURL'), uploadLabel: 'Upload Avatar or Photo' })}
              </div>
              {this.props.textField('firstName', { placeholder: 'Add First Name', label: 'First Name', value: util.getValue(data, 'firstName') })}
              {this.props.textField('lastName', { placeholder: 'Add Last Name', label: 'Last Name', value: util.getValue(data, 'lastName') })}
              {this.props.textField('email', { placeholder: 'Add Email', label: 'Email', validate: 'email', value: util.getValue(data, 'email') })}
            </div>
          </div>
        </Collapse>
        <Collapse
          default={'closed'}
          iconPrimary={'shield'}
          label={'Change Password'}
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <h4>Please enter your current password and the new password you want to change it to.</h4>
              {this.props.textField('password', {label: 'Current Password', placeholder: 'Enter current password', type: 'password', maxLength:32, strength: false})}
              {this.props.textField('newPassword', {label: 'New Password', placeholder: 'Enter new password', validate: 'password', type: 'password', maxLength:32, strength: true})}
            </div>
          </div>
        </Collapse>
        <Collapse
          default={'closed'}
          iconPrimary={'book-open'}
          label={'Additional Details'}
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              {this.props.textField('phone', { placeholder: 'Add Phone Number', label: 'Phone Number', validate: 'phone', value: _v.formatPhone(util.getValue(data, 'phone')) })}
              {this.props.textField('occupation', { placeholder: 'Add Occupation', label: 'Occupation', value: util.getValue(data, 'occupation') })}
              {this.props.textField('employer', { placeholder: 'Add Employer', label: 'Employer', value: util.getValue(data, 'employer') })}
              {this.props.calendarField('dateOfBirth', { label: 'Date of Birth', validate: 'date', validateOpts: { }, value: util.getValue(data, 'dateOfBirth') })}
            </div>
          </div>
        </Collapse>
        <div className='column center'>{this.props.saveButton(this.processForm, { style: { width: 150 } })}</div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
    item: state.resource[props.resource] ? state.resource[props.resource] : {},
    userID: state.resource.userID
  }
}

const FormConnect = connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource
})(MyAccountForm)


export default class MyAccount extends Component {

  render() {

    const resource = 'singleUser';

    return (
      <div className='settingsPage'>
        <Header noSubNav={true} noFixed={true} loader={this.props.loader} location={this.props.routeProps.location} history={this.props.routeProps.history} />
        <div className='mainContent'>
          <div className='container'>
            {this.props.isFetching && this.props.loader(`Loading data`)}
            <Form name={resource}>
              <FormConnect {...this.props} resource={resource} />
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
