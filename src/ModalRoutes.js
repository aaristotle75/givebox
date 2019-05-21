import React, { Component } from 'react';
import { ModalRoute } from 'givebox-lib';

export default class ModalRoutes extends Component {

  render() {

    const {
      loadComponent,
      location,
      appRef
    } = this.props;

    return (
      <div id='modal-routes'>

        {/*---- Common ------*/}
        <ModalRoute appRef={appRef}  id='logout' component={(props) => loadComponent('modal/common/Logout', {routeProps: location, useProjectRoot: false, props: props})} className='flexWrapper' effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute appRef={appRef}  id='avatar' component={(props) => this.props.loadComponent('modal/common/Avatar', {useProjectRoot: false, props: props })} effect='slideFromRight' style={{ width: '420px' }} />
        <ModalRoute appRef={appRef}  id='delete' component={(props) => this.props.loadComponent('modal/common/Delete', {useProjectRoot: false, props: props })} className='flexWrapper' effect='3DFlipVert' style={{ width: '50%' }} />

        {/*------ Payment ------*/}
        <ModalRoute appRef={appRef}  id='sendEmail' component={(props) => this.props.loadComponent('modal/demo/SendEmailModal', {useProjectRoot: false, props: props })} effect='3DFlipVert' style={{ width: '50%' }} />

      </div>
    )
  }
}
