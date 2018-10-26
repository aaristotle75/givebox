import React, { Component } from 'react';
import { Form } from 'givebox-lib';
import TestForm from './TestForm';

export default class Dashboard extends Component {

  render() {

    return (
      <div>
        Dashboard
        <h1>Header 1</h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>
        <h5>Header 5</h5>
        <h6>Header 6</h6>
        <p>Paragraph</p>
        <p>Paragraph<span className="smallText">with small caption text</span></p>
        <Form
          name="testForm"
          defaults={{
            required: false
          }}
        >
          <TestForm />
        </Form>
      </div>
    )
  }
}
