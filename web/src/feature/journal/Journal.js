import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as TVDML from 'tvdml';
import debug from 'debug';

import Shelf from './Shelf';
import VideoPlayer from '../video/VideoPlayer';

import { findVideoSource } from '../../utils';

import {
  fetchJournal,
  journalInvalidate,
} from './actions';

const log = debug('journal:Journal');

// we put global CSS into a string, because webpack can't use style-loader to
// inject into <head> normally as though it were a web context.
const styles = require('../../assets/styles.css').toString();

class Journal extends Component {
  componentDidMount() {
    log('Journal.componentDidMount');
    this.props.getVideos();
  }

  // Callback when focus is put onto a Video Tile
  // Written this way so 'this' works in callbacks
  onVideoHighlight = (event) => {
    log('Journal.onVideoHighlight');
    const category = event.target.getAttribute('data-category');
    const videoId = event.target.getAttribute('data-videoId');
    const videos = this.props.videos.categories[category];
    const index = videos.findIndex(video => video.id === videoId);
    log(`Video ${index} in '${category}'`);
  };

  // Callback when a Video Tile is selected with the select button
  // Written this way so 'this' works in callbacks
  onVideoSelection = (event) => {
    const videoId = event.target.getAttribute('data-videoId');
    const video = this.props.videos.byId[videoId];
    log('Journal.onVideoSelection: %s %O', videoId, video);
    TVDML.navigate('video', video.slug);
  };

  // Callback when a Video Tile is selected with the play button
  // Written this way so 'this' works in callbacks
  onVideoPlay = (event) => {
    const videoId = event.target.getAttribute('data-videoId');
    const video = this.props.videos.byId[videoId];
    const videoItem = video.media.items.find(v => v.type === 'video');
    const videoSource = findVideoSource(videoItem.sources);

    const player = new VideoPlayer({
      id: video.id,
      title: video.title,
      subtitle: video.summaryRaw,
      description: video.postRaw,
      url: videoSource.url,
      duration: videoItem.duration,
    });
    player.play();
  };

  // Callback when data needs to be refreshed. This happens when a user
  render() {
    log('Journal.render: %O', this.props);

    if (this.props.loading || this.props.isInvalid) {
      return '';
    }

    log('Returngin real doc');
    return (
      <document>
        <head>
          <style>
            {`
            ${styles}
            .shelf-title {
              font-size: 60;
              text-align: start;
              tv-align: start;
            }
          `}
          </style>
        </head>
        <stackTemplate class="background">
          <collectionList>
            { Object.entries(this.props.videos.categories).map(([category, videos]) => (
              <Shelf
                key={category}
                category={category}
                videos={videos}
                baseURL={this.props.baseURL}
                onVideoHighlight={this.onVideoHighlight}
                onVideoSelection={this.onVideoSelection}
                onVideoPlay={this.onVideoPlay}
              />
            ))
            }
          </collectionList>
        </stackTemplate>
      </document>
    );
  }
}

const mapStateToProps = state => ({
  baseURL: state.appReducer.launchParams.BASEURL,
  videos: state.journalReducer.videos,
  loading: state.journalReducer.loading,
  isInvalid: state.journalReducer.isInvalid,
});

const mapDispatchToProps = dispatch => ({
  getVideos: () => dispatch(fetchJournal()),
  invalidateData: () => dispatch(journalInvalidate()),
});

Journal.propTypes = {
  baseURL: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  isInvalid: PropTypes.bool,
  videos: PropTypes.shape({
    categories: PropTypes.object,
    byId: PropTypes.object,
  }),
  getVideos: PropTypes.func.isRequired,
};

Journal.defaultProps = {
  loading: true,
  isInvalid: false,
  videos: {
    categories: {},
    byId: {},
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Journal);
