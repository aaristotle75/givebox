import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Sidebar from "common/Sidebar";
import Header from "common/Header";

const Routes = ({ loadComponent }) => {
  return (
    <div>
      <Router>
        <Route
          render={({ location }) => (
            <div className="wrapper">
              <Route
                exact
                path="/"
                render={() => <Redirect to="/dashboard" />}
              />
              <Header />
              <Sidebar />
              <div className="contentContainer">
                <TransitionGroup>
                  <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Switch location={location}>
                      <Route path="/dashboard" render={(props) => loadComponent('dashboard/Dashboard')}  />
                      <Route path="/about" render={(props) => loadComponent('pages/About')}  />
                      <Route path="/contact" render={(props) => loadComponent('pages/Contact')}  />                      
                      <Route render={() => <div>Error</div>} />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </div>
            </div>
          )}
        />
      </Router>
    </div>
  )
}

export default Routes;
