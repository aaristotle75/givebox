import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { util } from 'givebox-lib';
import ModalRoutes from './ModalRoutes';

class Routes extends Component {

  constructor(props) {
    super(props);
    this.appRef = React.createRef();
  }

  render() {

    const {
      loadComponent
    } = this.props;


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
                    <Route exact path='/' render={() => <Redirect to={'/public'}/> } />
                    <Route exact parent='gbx' path='/public' render={(props) => loadComponent('demo/PublicForm', { routeProps: props })}  />
                    <Route exact parent='gbx' path='/private' render={(props) => loadComponent('demo/PrivateForm', { routeProps: props })}  />
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
