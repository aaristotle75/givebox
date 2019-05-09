import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  GBLink,
  types,
  CodeBlock,
  getResource,
  sendResource,
  removeResource,
  toggleModal
} from 'givebox-lib';
import GBX from 'common/GBX';
import {
  FacebookShareButton,
  FacebookIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  TwitterShareButton,
  TwitterIcon,
  PinterestShareButton,
  PinterestIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';

const GBX_URL = process.env.REACT_APP_GBX_URL;
const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class ShareForm extends Component {

  constructor(props) {
    super(props);
    this.openGBX = this.openGBX.bind(this);
    this.shareLink = this.shareLink.bind(this);
    this.toggleLink = this.toggleLink.bind(this);
		this.state = {
			shortLink: true
		}
  }

  componentDidMount() {
    if (this.props.id) {
      this.props.getResource('article', {
        id: [this.props.id]
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.props.removeResource('article');
  }

  openGBX() {
    const url = `${GBX_URL}/${this.props.id}?preview=true`;
    GBX.load(url);
  }

  shareLink() {
    const article = this.props.article;
    const ID = this.props.id;
		const link = this.state.shortLink ? `${GBX_SHARE}/${ID}` : `${GBX_SHARE}/${article.slug}-${ID}`;
    return link;
  }

  toggleLink() {
    this.setState({shortLink: this.state.shortLink ? false : true});
  }

  render() {

    const {
      article,
      id
    } = this.props;

    const {
      shortLink
    } = this.state;

    if (util.isEmpty(article)) return this.props.loader('Loading article...');

		const title = article.title;
		const shareUrl = `${GBX_SHARE}/${article.slug}-${id}`;
		const shortUrl = `${GBX_SHARE}/${id}`;
    const image = util.imageUrlWithStyle(article.imageURL, 'medium');
		const description = article.summary;
    const iconBgStyle = {};
    const shareIconSize = 55;

    return (
      <div className='modalFormContainer center share'>
        <h2>{util.getValue(article, 'title')}</h2>
        <h3>Copy and paste this link for your website, emails or texts</h3>
				<div className='center'><CodeBlock type="javascript" text={this.shareLink()} name=" Copy Link" /></div>
        <h4 className='center'> <GBLink onClick={this.toggleLink}>Show {shortLink ? 'long' : 'short'} link <span className={`icon icon-${shortLink ? 'link' : 'link-2'}`}></span></GBLink></h4>
        <h3 style={{paddingTop: 20}} className="center">Share on social media</h3>
        <ul className="center">
          <li>
            <FacebookShareButton
              url={shareUrl}
              quote={title}>
              <FacebookIcon
                iconBgStyle={iconBgStyle}
                size={shareIconSize}
                round />
            </FacebookShareButton>
					</li>
					<li>
            <TwitterShareButton
              url={shortUrl}
              title={title}>
              <TwitterIcon
                iconBgStyle={iconBgStyle}
                size={shareIconSize}
                round />
            </TwitterShareButton>
          </li>
          <li>
            <GooglePlusShareButton
              url={shareUrl}>
              <GooglePlusIcon
                iconBgStyle={iconBgStyle}
                size={shareIconSize}
                round />
            </GooglePlusShareButton>
					</li>
					<li>
            <PinterestShareButton
              url={shareUrl}
              media={image}
              windowWidth={700}
              windowHeight={600}>
              <PinterestIcon
                iconBgStyle={iconBgStyle}
                size={shareIconSize}
                round />
            </PinterestShareButton>
          </li>
          <li>
            <LinkedinShareButton
              url={shareUrl}
              title={title}
              description={description}>
              <LinkedinIcon
                iconBgStyle={iconBgStyle}
                size={shareIconSize}
                round />
            </LinkedinShareButton>
					</li>
					<li>
            <EmailShareButton
              url={shareUrl}
              subject={title}
              body={shareUrl}>
              <EmailIcon
                iconBgStyle={iconBgStyle}
                size={shareIconSize}
                round />
            </EmailShareButton>
          </li>
        </ul>
      </div>
    )
  }
}


function mapStateToProps(state, props) {

  const resource = state.resource.article ? state.resource.article : {};
  const article = util.getValue(resource, 'data', {});

  return {
    resource,
    article
  }
}

export const ShareConnect = connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource,
  toggleModal
})(ShareForm);


export default class Share extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id || null
    }
  }

  render() {

    const {
      id
    } = this.state;

    return (
      <div className='modalFormContainer center'>
        <ShareConnect {...this.props} id={id} />
      </div>
    )
  }
}
