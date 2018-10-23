import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import * as TVDML from 'tvdml';
import debug from 'debug';

import VideoTile from '../video/VideoTile';
import VideoPlayer from '../video/VideoPlayer';

import { findVideoSource } from '../../utils';
import {
  realtimeTypeSearch,
  fetchMoreResults,
  executeSearch,
} from './actions';

const log = debug('search:Search');

// we put global CSS into a string, because webpack can't use style-loader to
// inject into <head> normally as though it were a web context.
const styles = require('../../assets/styles.css').toString();

class Search extends Component {
  constructor(props) {
    super(props);
    this.searchFieldRef = React.createRef();
  }

  componentDidMount() {
    log('componentDidMount');
    const keyboard = this.searchFieldRef.current.getFeature('Keyboard');
    keyboard.onTextChange = debounce(500, false, this.searchFieldChanged.bind(this, keyboard));
  }

  // Event handler for when scrolling and need more paginated results
  // The debounce is to ensure it does not fire too frequently if the user is frenzied scrolling
  onNeedsMore = debounce(1000, true, () => {
    log('onNeedsMore');
    this.props.getMoreResults();
  });

  // Callback when focus is put onto a Video Tile
  // This is needed because onNeedsmore is not firing on the <grid> element
  // We want to trigger onNeedsmore when we enter the last row (4 items) in the grid
  // Written this way so 'this' works in callbacks
  onVideoHighlight = (event) => {
    log('onVideoHighlight');
    const videoId = event.target.getAttribute('data-videoId');
    const videos = this.props.results.items;
    const index = videos.findIndex(video => video.id === videoId);

    // If we are within the last row, first the event
    // Use 5 instead of 4 since index is zero based
    if (index >= videos.length - 5) {
      this.onNeedsMore();
    }
  };

  // Callback when a Video Tile is selected with the select button
  // Written this way so 'this' works in callbacks
  onVideoSelection = (event) => {
    const videoId = event.target.getAttribute('data-videoId');
    const video = this.props.results.items.find(obj => obj.id === videoId);
    log('onVideoSelection: %s %O', videoId, video);
    TVDML.navigate('video', video.slug);
  };

  // Callback when a Video Tile is selected with the play button
  // Written this way so 'this' works in callbacks
  onVideoPlay = (event) => {
    const videoId = event.target.getAttribute('data-videoId');
    const video = this.props.results.items.find(obj => obj.id === videoId);
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

  // Execute a search if the terms are long enough
  searchFieldChanged(keyboard) {
    const search = keyboard.text.trim();
    if (search.length >= 3) {
      this.props.onSearchInputKey(search);
    }
  }

  render() {
    log('render: Props %O', this.props);

    let header = (
      <header>
        <title>
          { this.props.query.length > 0 ? `No Results for '${this.props.query}'` : 'Please Enter a Search'}
        </title>
      </header>
    );

    if (this.props.loading) {
      header = (
        <header>
          <title>
            Searching...
          </title>
        </header>
      );
    } else if (this.props.results.total > 0) {
      header = (
        <header>
          <title>
            {'Total Results:  '}
            {this.props.results.total}
          </title>
        </header>
      );
    }

    return (
      <document>
        <head>
          <style>
            {`${styles}`}
          </style>
        </head>
        <searchTemplate style={{ marginTop: 100 }}>
          <searchField ref={this.searchFieldRef} />
          <collectionList>
            <grid onHighlight={this.onVideoHighlight}>
              {header}
              <section onSelect={this.onVideoSelection} onPlay={this.onVideoPlay}>
                {
                this.props.results.items.map(video => (
                  <VideoTile
                    key={video.id}
                    data={video}
                    video={video}
                    titleColor="white"
                    baseURL={this.props.baseURL}
                  />
                ))
                }
              </section>
            </grid>
          </collectionList>
        </searchTemplate>
      </document>
    );
  }
}

const mapStateToProps = state => ({
  baseURL: state.appReducer.launchParams.BASEURL,
  loading: state.searchReducer.loading,
  results: state.searchReducer.results,
  search: state.searchReducer.search,
  query: state.searchReducer.query,
});

const mapDispatchToProps = dispatch => ({
  onSearchInputKey: val => dispatch(realtimeTypeSearch(val)),
  getMoreResults: () => dispatch(fetchMoreResults()),
  refreshSearch: query => dispatch(executeSearch(query)),
});

Search.propTypes = {
  baseURL: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.string,
  results: PropTypes.shape({
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
  }),
  onSearchInputKey: PropTypes.func.isRequired,
  getMoreResults: PropTypes.func.isRequired,
};

Search.defaultProps = {
  query: '',
  results: {
    items: [],
    total: 0,
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
