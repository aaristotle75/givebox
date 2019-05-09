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

        {/*----- Money ------*/}
        <ModalRoute appRef={appRef}  id='sendReceipt' component={(props) => this.props.loadComponent('modal/money/SendReceipt', {useProjectRoot: false, props: props })} className='flexWrapper' effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute appRef={appRef}  id='recurringModify' component={(props) => this.props.loadComponent('modal/money/RecurringModify', {useProjectRoot: false, props: props })} className='flexWrapper' effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalRoute appRef={appRef}  id='recurring' component={(props) => this.props.loadComponent('modal/money/Recurring', {useProjectRoot: false, props: props })} className='flexWrapper' effect='scaleUp' style={{ width: '70%' }} />
        <ModalRoute appRef={appRef}  id='payMethods' component={(props) => this.props.loadComponent('modal/money/PayMethods', {useProjectRoot: false, props: props })} className='flexWrapper' effect='scaleUp' style={{ width: '60%' }} />
        <ModalRoute appRef={appRef}  id='payMethodForm' component={(props) => this.props.loadComponent('modal/money/PayMethodForm', {useProjectRoot: false, props: props })} className='flexWrapper' effect='scaleUp' style={{ width: '50%' }} />

      </div>
    )
  }
}
