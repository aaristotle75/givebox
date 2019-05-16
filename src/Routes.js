import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { util } from 'givebox-lib';
import Redirect from 'common/Redirect';
import ModalRoutes from './ModalRoutes';

class Routes extends Component {

  constructor(props) {
    super(props);
    this.appRef = React.createRef();
  }

  render() {

    const {
      loadComponent,
      session,
      access,
      authenticated
    } = this.props;

    /*
    if (!authenticated) return ( this.props.loader('Authenticating', 'authenticating') );

    if (util.isLoading(session) || util.isEmpty(access)) {
      return this.props.loader('Trying to load initial resources: session');
    }
    */

    return (
      <Router>
        <div>
          <Switch>
          <Route
            render={({ location, history }) => (
              <div className='layout' ref={this.appRef}>
                <ModalRoutes
                  {...this.props}
                  appRef={this.appRef}
                  history={history}
                  location={location} />
                <div id='layout-main' className='layout-main'>
                  <Switch location={location}>
                    <Route exact path='/' component={Redirect} />
                    <Route exact parent='gbx' path='/:id' render={(props) => loadComponent('common/Gateway', { routeProps: props })}  />
                    <Route render={(props) => loadComponent('common/Error')} />
                  </Switch>
                </div>
              </div>
            )}
          />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default Routes;
