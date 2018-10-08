import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debug from 'debug';

import VideoPlayer from './VideoPlayer';
import {
  findVideoSource,
} from '../../utils';

import {
  fetchVideo,
  videoInvalidate,
} from './actions';


import bg from '../../assets/lightbg.png';
import eyebrow from '../../assets/eyebrow.png';
import premiumLock from '../../assets/premium.png';

const log = debug('video:Video');

// we put the CSS into a string, because webpack can't use style-loader to
// inject into <head> normally as though it were a web context.
const styles = require('../../assets/styles.css').toString();

class Video extends Component {
  constructor(props) {
    super(props);
    this.listeners = [];
  }

  componentDidMount() {
    log('componentDidMount: %O', this.props);
    this.props.getVideo(this.props.slug);
  }

  componentDidUpdate() {
    log('componentDidupdate: %O', this.props);
    if (this.props.invalid && !this.props.loading) {
      this.props.getVideo(this.props.slug);
    }
  }

  // When the component is unmounting, remove the auth listeners
  componentWillUnmount() {
    log('componentWillUnmount');
    this.listeners.forEach((item) => { item.remove(); });
  }

  playVideo = () => {
    const player = new VideoPlayer({
      id: this.props.video.id,
      title: this.props.video.title,
      subtitle: this.props.video.summaryRaw,
      description: this.props.video.postRaw,
      url: this.videoSource.url,
      duration: this.videoItem.duration,
    });
    player.play();
  };

  // Callback when data needs to be refreshed. This happens when a user
  // authenticated or unauthenticated to make sure that the Journal data
  // has the context of their login/subscription
  // Written this way so 'this' works in callbacks
  invalidateData = () => {
    log('invalidateData');
    this.props.invalidateData();
  };

  render() {
    log('render: %O', this.props);

    if (!this.props.video || this.props.loading) {
      return '';
    }

    this.videoItem = this.props.video.media.items.find(v => v.type === 'video');
    this.photoItem = this.props.video.media.items.find(v => v.type === 'photo');
    this.videoSource = findVideoSource(this.videoItem.sources);

    let videoThumbnail = (
      <lockup>
        <img class="video" src={this.photoItem.desktop} />
      </lockup>
    );


    if (this.props.video.isPaid) {
      videoThumbnail = (
        <lockup>
          <img class="video" src={this.photoItem.desktop} />
          <overlay>
            <img class="premium" src={`${this.props.baseURL}${premiumLock}`} />
          </overlay>
        </lockup>
      );
    }

    let playTitle = 'PLAY';
    if (this.props.video.isPaid) {
      playTitle = 'TRAILER';
    }

    return (
      <document>
        <head>
          <style>
            {`
            ${styles}
            .video {
              height: 500;
              width: 900;
              margin: 50 75 0 75;
            }
            .video-text {
              font-size: 30;
              max-width: 800;
              tv-text-max-lines: 50;
              margin-top: 15;
            }
            .action-button {
              margin: 20;
            }
            .action-title {
              text-align: center;
              font-size: 25;
              font-weight: bold;
            }
          `}
          </style>
        </head>
        <divTemplate>
          <background>
            <img src={`${this.props.baseURL}${bg}`} />
          </background>
          <header class="top" style={{ marginTop: 50, marginLeft: 75 }}>
            <title
              class="title black top"
              style={{
                textAlign: 'start',
                tvAlign: 'start',
                fontSize: 100,
              }}
            >
              {this.props.video.title}
            </title>
          </header>
          <banner class="top" style={{ paddingTop: 25 }}>
            <row style={{ tvContentAlign: 'top', width: '-webkit-fill-available', tvAlign: 'left' }}>
              {videoThumbnail}

              <organizer style={{ minWidth: 800, marginTop: 40 }}>
                <img src={`${this.props.baseURL}${eyebrow}`} width="80" height="40" />
                { this.props.video.people ? (
                  <text class="title black" style={{ fontSize: 50 }}>
                    { 'by ' }
                    {this.props.video.people.join(', ')}
                  </text>
                ) : '' }
                <text class="title red" style={{ fontSize: 40, height: 40 }}>
                  {formatDate(new Date(this.props.video.publishingDate))}
                </text>
                { this.videoItem.duration
                  ? (
                    <row style={{ tvContentAlign: 'center', margin: '10 0' }}>
                      <text class="title black" style={{ fontSize: 40 }}>
                        {'Run Time: '}
                      </text>
                      <text class="text video-text black">
                        {formatDuration(this.videoItem.duration)}
                      </text>
                    </row>
                  ) : '' }
                <description class="text video-text black" handlesOverflow="true" moreLabel="more">
                  {this.props.video.summaryRaw}
                </description>
                { (this.props.video.isPaid) ? (
                  <text class="text video-text black" style={{ marginTop: 50 }}>
                    Full length video is available with a Journal Subscription
                  </text>
                ) : '' }
                <row style={{ marginTop: 50 }}>
                  <buttonLockup
                    onSelect={this.playVideo}
                    onPlay={this.playVideo}
                    theme="light"
                    class="action-button"
                  >
                    <badge src="resource://button-play" />
                    <title class="black action-title">
                      {playTitle}
                    </title>
                  </buttonLockup>
                </row>
              </organizer>
            </row>
          </banner>
        </divTemplate>
      </document>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {
    baseURL: state.appReducer.launchParams.BASEURL,
    loading: state.videoReducer.loading,
    invalid: state.videoReducer.invalid,
    video: null,
  };

  // Don't assign the state video to our props if it is
  // not the video for the slug we are initialized with
  // Leaving it blank will force the component to fetch the data
  const { video } = state.videoReducer;
  if (video && video.slug === ownProps.slug) {
    props.video = video;
  }

  return props;
}

const mapDispatchToProps = dispatch => ({
  getVideo: slug => dispatch(fetchVideo(slug)),
  invalidateData: () => dispatch(videoInvalidate()),
});

Video.propTypes = {
  baseURL: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    publishingDate: PropTypes.string.isRequired,
    summaryRaw: PropTypes.string.isRequired,
    postRaw: PropTypes.string.isRequired,
    people: PropTypes.arrayOf(PropTypes.string),
    isPaid: PropTypes.bool,
    media: PropTypes.shape({
      items: PropTypes.array.isRequired,
    }).isRequired,
  }),
  getVideo: PropTypes.func.isRequired,
  invalidateData: PropTypes.func.isRequired,
};

Video.defaultProps = {
  video: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Video);
