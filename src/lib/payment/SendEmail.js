import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextField,
  RichTextField
} from 'givebox-lib';

class SendEmail extends Component {

  componentWillUnmount() {
  }

  onChange(e) {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;
    console.log('execute onChnage', name, value);
  }

  onBlur(name, value, hasText) {
    console.log('execute onBlur', name, value, hasText);
  }

  render() {

    return (
      <div>
        <h3 className='center'>Send Email</h3>
        <TextField
          name='recipients'
          label='Email Recipients'
          fixedLabel={true}
          placeholder='Add email addresses, separate multiple emails by commas'
          required={true}
          onChange={this.onChange}
        />
        <RichTextField
          label='Message to recipients'
          placeholder='Please write something...'
          modal={false}
          required={false}
          onBlurEditor={this.onBlur}
        />
      </div>
    )
  }
}

SendEmail.defaultProps = {
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(SendEmail)
