import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResource, util, ModalLink, GBLink, toggleModal } from 'givebox-lib';

class Avatar extends Component {

  constructor(props) {
    super(props);
    this.directLink = this.directLink.bind(this);
  }

  directLink(link) {
    this.props.toggleModal('avatar', false);
    this.props.history.push(link);
  }

  openSupport() {
    window.open('http://support.givebox.com', '_blank');
  }

  render() {

    const {
      access
    } = this.props;

    return (
      <div className='avatarMenu'>
        <div className='topSection'>
          <div className='leftSide'>
            {access.imageURL ?
              <div className='avatarImage'><img src={util.imageUrlWithStyle(access.imageURL, 'medium')} alt='Avatar Medium Circle' /></div>
            :
              <div className='defaultOrg'>
                <GBLink onClick={() => this.directLink('/settings')}>
                  <span className='defaultOrgImg'><span className='icon icon-instagram'></span></span>
                  <br />Upload logo
                </GBLink>
              </div>
            }
          </div>
          <div className='rightSide'>
            <span className='line'>{access.fullName}</span>
            <span className='line' style={{fontWeight: 300}}>{access.email}</span>
          </div>
        </div>
        <div className='listSection'>
          <ul>
            <li onClick={() => this.directLink('/settings')}><span className='icon icon-sliders'></span>  <span className='text'>Settings</span></li>
            <li onClick={() => this.openSupport()}><span className='icon icon-help-circle'></span>  <span className='text'>Support</span></li>
          </ul>
        </div>
        <div className='bottomSection'>
          <ModalLink type='link' id='logout'>Logout</ModalLink>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    access: state.resource.access ? state.resource.access : {}
  }
}

export default connect(mapStateToProps, {
  getResource,
  toggleModal
})(Avatar)
