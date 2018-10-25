import React, { Component } from 'react';
import Routes from 'Routes';
import Loadable from 'react-loadable';

export const AppContext = React.createContext();

class App extends Component {

  constructor(props) {
    super(props);
    this.loadComponent = this.loadComponent.bind(this);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < props.mobileBreakpoint ? true : false
    }
  }

  loader(msg) {
    return (
      <div className="loader">{msg}</div>
    )
  }

  loadComponent(module, customParams = {}) {
    const defaultParams = { routeProps: null, props: null, callback: null, className: 'content' };
    const params = Object.assign({}, defaultParams, customParams);
    let modal = false;
    let moduleToLoad = module;

    // If module path begins with modal/ display as modal
    if (module.indexOf('modal/') !== -1) {
      modal = true;
      params.className = 'modalWrapper';
      moduleToLoad = moduleToLoad.replace('modal/', '');
    }

    const Component = Loadable({
      loader: () => import(`/${moduleToLoad}`),
      loading: () => modal ? '' : this.loader(`Trying to load component ${moduleToLoad}`)
    });
    return (
      <div id={`root-${params.className}`} className={params.className}>
        <Component
          {...params.props}
          loader={this.loader}
          routeProps={params.routeProps}
          mobile={this.state.mobile}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <AppContext.Provider
          value={{
            title: "Givebox Boiler"
          }}
        >
        <Routes loadComponent={this.loadComponent} />
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
