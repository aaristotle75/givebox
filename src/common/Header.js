import React, { Component } from 'react';
import { util, GBLink, ModalLink, Fade } from 'givebox-lib';
import { connect } from 'react-redux';
import { toggleLeftMenu } from 'redux/actions';
import Waypoint from 'react-waypoint';
import AnimateHeight from 'react-animate-height';
import { navArray } from './utility';
import animateScrollTo from 'animated-scroll-to';

class Header extends Component {

  constructor(props) {
    super(props);
    this.setTitle = this.setTitle.bind(this);
    this.toTop = this.toTop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      title: '',
      fixed: false,
      fixedClass: false,
      toTop: false
    }
  }

  componentDidMount() {
    this.setTitle(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setTitle(this.props.location.pathname);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onClick(to) {
    this.timeout = setTimeout(() => {
      this.props.history.push(to);
      this.timeout = null;
    }, 0);
  }

  setTitle(pathname) {
    const arr = pathname.split('/');
    const parent = util.lookup(navArray, 'parent', arr[1]);
    let title = <span className='noLink'><span style={{marginRight: 5}} className={`titleIcon icon icon-${parent.icon}`}></span><span>{parent.name}</span></span>;
    if (arr.length === 3) {
      const child = util.lookup(parent.children, 'child', arr[2]);
      title = <GBLink onClick={() => this.onClick(parent.path)}><span style={{marginRight: 5}} className={`titleIcon icon icon-${child.icon}`}></span>{parent.name} <span className='icon icon-chevron-right'></span><span className='childLink'>{child.name}</span></GBLink>;
    }
    this.setState({ title: title });
  }

  onChange(pos) {

    if (this.props.noFixed) {
      this.setState({ fixed: false, fixedClass: false, toTop: false });
    } else {
      if (pos.currentPosition === 'inside') {
        this.setState({ fixed: false, fixedClass: false, toTop: false });
      }
      if (pos.currentPosition === 'above') {
        if (!this.props.filterOpen) {
          this.setState({ fixed: true });
          this.timeout = setTimeout(() => {
            this.setState({ fixedClass: true, toTop: true });
            this.timeout = null;
          }, 200);
        } else {
          this.timeout = setTimeout(() => {
            this.setState({ toTop: true });
            this.timeout = null;
          }, 200);
        }
      }
    }
  }

  toTop() {
    const el = document.getElementById('layout-main');
    animateScrollTo(0, { element: el });
  }

  render() {

    const {
      access
    } = this.props;

    const {
      title
    } = this.state;

    if (util.isEmpty(access)) {
      return this.props.loader('Loading access');
    }

    const el = document.getElementById('layout-main');
    const image = access.imageURL || null;
    const userName = access.fullName;

    return (
        <div className={`layout-top ${this.state.fixedClass ? 'fixed' : ''}`}>
          <Waypoint
            onPositionChange={this.onChange}
            scrollableAncestor={el}
          />
          <AnimateHeight
            duration={500}
            height={this.state.fixed ? 1 : 'auto'}
          >
            <header className={`navbar`}>
              <div className='container'>
                <GBLink className={`left-menu-open`} onClick={() => this.props.toggleLeftMenu(true)}><span className='icon icon-menu'></span></GBLink>
                <div className='title'>
                  {title}
                </div>
                <div className='avatarLink'>
                  <ModalLink opts={{history: this.props.history }} id='avatar' className='link'>
                    {image ? <div className='avatarImage'><img src={util.imageUrlWithStyle(image, 'small')} alt='Avatar Small Circle' /></div> :
                      <div className='defaultOrgImg'><span className='icon icon-instagram'></span></div>
                    }
                    <span className='orgName'>{userName}</span>
                  </ModalLink>
                </div>
              </div>
            </header>
          </AnimateHeight>
          { !this.props.noSubNav &&
          <div className='subNavWrapper'>
            <AnimateHeight
              duration={500}
              height={this.state.fixed && !this.state.fixedClass ? 0 : 'auto'}
            >
              <Fade
                duration={300}
                in={!this.state.fixed || (this.state.fixed && this.state.fixedClass) ? true : false }
              >
              <header style={this.props.subNavStyle} className={`${this.state.fixedClass ? 'subNavFixed' : 'subNav'}`}>
                <div className='container'>
                  {this.props.children}
                </div>
              </header>
              </Fade>
            </AnimateHeight>
            <Fade
              duration={500}
              in={this.state.toTop}
            >
              <GBLink onClick={this.toTop} className='toTop'><span className='icon icon-chevrons-up'></span></GBLink>
            </Fade>
          </div>
          }
        </div>
    )
  }
}

Header.defaultProps = {
  subNavStyle: {},
  noFixed: false,
  noSubNav: false
}

function mapStateToProps(state, props) {
  return {
    openLeftMenu: state.cloud.openLeftMenu,
    filterOpen: state.app.filterOpen,
    access: state.resource.access ? state.resource.access : {}
  }
}

export default connect(mapStateToProps, {
  toggleLeftMenu
})(Header);
