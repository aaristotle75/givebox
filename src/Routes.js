import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { util } from 'givebox-lib';
import ModalRoutes from './ModalRoutes';
import LeftSide from 'common/LeftSide';

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

    if (!authenticated) return ( this.props.loader('Authenticating', 'authenticating') );

    if (util.isLoading(session) || util.isEmpty(access)) {
      return this.props.loader('Trying to load initial resources: session');
    }

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
                <Route
                  exact
                  path='/'
                  render={() => <Redirect to='/history' />}
                />
                <Route
                  exact
                  path='/wallet'
                  render={() => <Redirect to='/history' />}
                />
                <LeftSide location={location} history={history} />
                <div id='layout-main' className='layout-main'>
                  <Switch location={location}>
                    <Route parent='history' path='/history' render={(props) => loadComponent('money/Transactions', { routeProps: props })}  />
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
