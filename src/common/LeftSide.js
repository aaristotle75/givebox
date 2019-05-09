import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleLeftMenu } from 'redux/actions';
import { GBLink } from 'givebox-lib';
import { navArray } from './utility';
import has from 'has';
import AnimateHeight from 'react-animate-height';

class LeftSide extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.getActive = this.getActive.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.list = this.list.bind(this);
    this.subList = this.subList.bind(this);
    this.state = {
      active: 'analytics',
      sublistActive: null,
      sublistOffset: 0,
      indicator: null,
      topHeight: 71,
      listHeight: 50,
      sublistHeight: 47,
      listTopBeforeSublist: {},
      showSublist: false,
      mounted: false,
    }
    this.listRefs = {};
    this.sublistRefs = {};
  }

  componentDidMount() {
    this.getActive(this.props.history.location.pathname, false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.mounted) {
      this.getActive(this.props.history.location.pathname);
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.getActive(this.props.history.location.pathname);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  getActive(str, mounted = true) {
    const arr = str.split('/');
    let indicator = null;
    let active = this.state.active;
    let sublistActive = this.state.sublistActive;
    const listTopBeforeSublist = this.state.listTopBeforeSublist;

    if (!mounted) {
      Object.entries(this.listRefs).forEach(([key, value]) => {
        listTopBeforeSublist[key] = value.current.getBoundingClientRect().top;
      });
    }

    if(arr.length === 2 && has(this.listRefs, arr[1])) {
      active = arr[1];
      sublistActive = null;
      indicator = listTopBeforeSublist[active];
    }
    if(arr.length === 3 && has(this.sublistRefs, arr[2])) {
      indicator = this.sublistRefs[arr[2]].current.getBoundingClientRect().top;
      active = arr[1];
      sublistActive = arr[2];
    }

    const parentIndex = navArray.findIndex((el) => {
      return el.parent === active;
    });
    sublistActive = has(navArray[parentIndex], 'navChildren') ? sublistActive : null;
    const showSublist = has(navArray[parentIndex], 'children') && has(navArray[parentIndex], 'navChildren') && mounted ? true : false;

    this.timeout = setTimeout(() => {
      this.setState({
        active,
        indicator,
        sublistActive,
        listTopBeforeSublist,
        showSublist,
        mounted
      });
      this.timeout = null;
    }, 0);
  }

  onClick(to) {
    this.timeout = setTimeout(() => {
      this.close();
      this.props.history.push(to);
      this.timeout = null;
    }, 0);
  }

  open() {
    this.props.toggleLeftMenu(true);
  }

  close() {
    this.props.toggleLeftMenu(false);
  }

  list() {
    const items = [];
    const defaultIndicator = {
      marginTop: 0
    };
    Object.entries(navArray).forEach(([key, value]) => {
      if (!this.state.sublistActive || this.state.active === value.parent) this.listRefs[value.parent] = React.createRef();
      items.push(
        <li ref={this.listRefs[value.parent]} key={key} className={`${this.state.active === value.parent && !this.state.sublistActive ? 'active' : ''} ${has(value, 'children') && has(value, 'navChildren') && this.state.active === value.parent ? 'hasChildren' : ''}`} onClick={() => this.onClick(value.path)}>
          <span className={`icon icon-${value.icon}`}></span> <span className='text'>{value.name}</span>
        </li>
      );
      let sublistKey = 0;
      if (has(value, 'children')) {
        items.push(this.subList(value.children, value.parent, this.state.active === value.parent && this.state.showSublist ? true : false));
        sublistKey = value.children.findIndex((el) => {
          return el.child === this.state.sublistActive;
        });
      }
      if (this.state.active === value.parent) {
        defaultIndicator.marginTop = key === 0 ? this.state.topHeight : (parseInt(key) * this.state.listHeight) + ((parseInt(sublistKey) + 1) * this.state.sublistHeight) + this.state.topHeight;
      }
    });
    const indicatorStyle = {
      opacity: 1,
      marginTop: this.state.indicator || defaultIndicator.marginTop
    };

    return (
      <ul className='nav'>
        <div style={indicatorStyle} className='active-indicator'>
          <div className='active-indicator-bar'></div>
        </div>
        {items}
      </ul>
    )
  }

  subList(children = null, parent, active = false) {
    const items = [];
    if (children) {
      Object.entries(children).forEach(([key, value]) => {
        this.sublistRefs[value.child] = React.createRef();
        items.push(
          <li ref={this.sublistRefs[value.child]} key={key} className={`sublist ${this.state.sublistActive === value.child ? 'active' : ''}`} onClick={() => this.onClick(value.path)}><span className={`icon icon-${value.icon}`}></span> <span className='text'>{value.name}</span></li>
        );
      });
    }
    return (
      <AnimateHeight
        key={`${parent}-sublist`}
        duration={500}
        height={active ? 'auto' : 0}
      >
        {items}
      </AnimateHeight>
    )
  }

  render() {

    return (
      <div className={`layout-left ${this.props.openLeftMenu ? 'expand' : ''}`}>
        <div onClick={this.close} className='layout-cover'></div>
        <div className='left-menu-close'><GBLink onClick={this.close}><span className='icon icon-x'></span></GBLink></div>
        <div className='layout-left-content'>
          <div className='layout-left-container'>
            <div className='logo'>
              <img src='https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo5.svg' alt='Givebox Logo' />
            </div>
            {this.list()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    openLeftMenu: state.cloud.openLeftMenu
  }
}

export default connect(mapStateToProps, {
  toggleLeftMenu
})(LeftSide);
