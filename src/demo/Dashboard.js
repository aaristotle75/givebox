import React, { Component } from 'react';
import TestForm from './TestForm';
import { Form } from 'givebox-lib';

export default class Dashboard extends Component {

  render() {

    return (
      <div>
        Dashboard
        <Form name='testForm'>
          <TestForm />
        </Form>
      </div>
    )
  }
}
