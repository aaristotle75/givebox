import React, { Component } from 'react';
import { connect } from 'react-redux';
import Routes from './Routes';
import Loadable from 'react-loadable';
import Error from 'common/Error';
import has from 'has';
import { userLogout } from 'redux/actions';
import {
  resourceProp,
  Loader,
  getResource,
  sendResource,
  reloadResource,
  ModalLink,
  util,
  toggleModal,
  setPrefs
} from 'givebox-lib';

export const AppContext = React.createContext();
const ENTRY_URL = process.env.REACT_APP_ENTRY_URL;
const ENV = process.env.REACT_APP_ENV;

class AppClass extends Component {

  constructor(props) {
    super(props);
    this.loadComponent = this.loadComponent.bind(this);
    this.loadComponentLoading = this.loadComponentLoading.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.initResources = this.initResources.bind(this);
    this.setIndexState = this.setIndexState.bind(this);
    this.logout = this.logout.bind(this);
    this.logoutCallback = this.logoutCallback.bind(this);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < props.mobileBreakpoint ? true : false,
      org: {},
      user: {},
      authenticated: false
    }
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    // Entry point - check if session exists and authenticate
    this.props.getResource('session', {callback: this.authenticate});
  }

  /**
  * Action function to set state while keeping current state
  * @params (string) key
  * @params (mixed) value
  */
  setIndexState(key, value) {
    const merge = {...this.state[key], ...value};
    this.setState(Object.assign({
      ...this.state,
      [key]: merge
    }));
  }

  /**
  * A callback from getting the session to authenticate the user
  * and set the selected org ID to either the user's default org or
  * if a masquerade set it to the mask org ID
  *
  * @param (object) res Response from the session requeset
  * @param (object) err Error from the request
  */
  authenticate(res, err, debug = false) {
    if (err) {
      // If no session is found redirect the user to sign in
      console.error('Err No session found redirect to ', ENTRY_URL);
      if (!debug) window.location.replace(`${ENTRY_URL}/login/wallet`);
    } else {
      // Authenticate
      this.setState({authenticated: true});
      let user = res.user;

      this.props.resourceProp('userID', user.ID);

      // set access
      const access = {
        userID: user.ID,
        initial: user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.firstName + ' ' + user.lastName,
        email: user.email,
        imageURL: user.imageURL
      };

      this.props.resourceProp('access', access);

      // Get init collection of resources
      this.initResources();
    }
  }

  initResources() {
  }

  loader(msg, className = '') {
    return (
      <Loader className={className} msg={msg} forceText={process.env.NODE_ENV !== 'production' && true} />
    )
  }

  loadComponentLoading(props) {
    if (props.error) {
      return <Error />;
    } else if (props.pastDelay) {
      return this.loader('Loading Component', 'loadComponent');
    } else {
      return null;
    }
  }

  /**
  * Dynamically load components by module path
  * @param {string} path to component to load
  * @param {object} opt - see options for possible params
  *
  * // Options //
  * @param {object} routeProps props sent by the Router
  * @param {object} props additional props
  * @param {function} callback
  * @param {string} className
  */
  loadComponent(path, opt = {}) {
    const defaults = {
      routeProps: null,
      props: null,
      callback: null,
      className: ''
    };
    const options = { ...defaults, ...opt };
    let modal = false;
    let moduleToLoad = path;

    // If module path begins with modal/ display as modal
    if (moduleToLoad.indexOf('modal/') !== -1) {
      modal = true;
      options.className = opt.className ? `modalWrapper ${opt.className}` : 'modalWrapper';
      moduleToLoad = moduleToLoad.replace('modal/', '');
    } else {
      options.className = opt.className ? `layout-main-wrapper ${opt.className}` : 'layout-main-wrapper';
    }

    const Component = Loadable({
      loader: () => import(`/${moduleToLoad}`),
      loading: modal ? () => '' : this.loadComponentLoading
    });

    return (
      <div id={`content-root`} className={options.className}>
        <Component
          {...options.props}
          loader={this.loader}
          routeProps={options.routeProps}
          mobile={this.state.mobile}
          isModal={modal}
          loadComponent={this.loadComponent}
          logout={this.logout}
          user={this.state.user}
          org={this.state.org}
          isSuper={this.state.user.role === 'super' ? true : false}
          isDev={process.env.REACT_APP_ENV === 'local' ? true : false}
        />
      </div>
    )
  }

  logout() {
    const endpoint = 'session';
    this.props.sendResource(
      endpoint, {
        method: 'delete',
        callback: this.logoutCallback
    });
  }

  logoutCallback() {
    const redirect = `${ENTRY_URL}/login/wallet`;
    this.props.userLogout();
    window.location.replace(redirect);
  }

  render() {

    return (
      <div className={`${this.state.mobile ? 'mobile' : 'desktop'}`}>
        <div id='app-root'>
          <AppContext.Provider
            value={{
              user: this.state.user,
              org: this.state.org
            }}
          >
            <Routes
              {...this.props}
              loader={this.loader}
              loadComponent={this.loadComponent}
              authenticated={this.state.authenticated}
            />
          </AppContext.Provider>
        </div>
        <div id='modal-root' ref={this.modalRef}></div>
        <div id='calendar-root'></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.resource.session ? state.resource.session : {},
    access: state.resource.access ? state.resource.access : {}
  }
}

const App = connect(mapStateToProps, {
  getResource,
  sendResource,
  reloadResource,
  resourceProp,
  userLogout,
  toggleModal,
  setPrefs
})(AppClass);

export default App;
