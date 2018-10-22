import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import debug from 'debug';

import { JOURNAL_PAGE_SIZE } from './actions';
import VideoTile from '../video/VideoTile';
import eyebrow from '../../assets/eyebrow.png';

const log = debug('journal:Shelf');

class Shelf extends Component {
  // Only update the Shelf if the new props have more Videos than we currently display
  // This is related to pagination
  shouldComponentUpdate(nextProps) {
    log(`Shelf.shouldComponentUpdate: ${this.props.videos.length !== nextProps.videos.length}`);
    return this.props.videos.length !== nextProps.videos.length;
  }

  // Event handler for when scrolling a Shelf and needing more Video
  // Written this way so 'this' works in callbacks
  onNeedsMore = () => {
    log('Shelf.onNeedsMore');
    if (this.props.loadingPage) {
      log('Already loading a page, do not load more yet');
      return;
    }
    const { category, videos } = this.props;
    const currentPage = Math.floor(videos.length / JOURNAL_PAGE_SIZE);
    const nextPage = currentPage + 1;
    log(`On page ${currentPage}, lets grab page: ${nextPage}`);

    this.props.getCategoryPage(category, nextPage);
  };

  render() {
    log('Shelf.render');
    return (
      <shelf
        onNeedsmore={debounce(500, true, this.onNeedsMore)}
        onHighlight={this.props.onVideoHighlight}
      >
        <header style={{ marginBottom: 45 }}>
          <img src={`${this.props.baseURL}${eyebrow}`} width="80" height="40" />
          <title class="title shelf-title black">
            {this.props.category}
          </title>
        </header>
        <section onSelect={this.props.onVideoSelection} onPlay={this.props.onVideoPlay}>
          {
          this.props.videos.map(video => (<VideoTile key={video.id} video={video} category={this.props.category} titleColor="black" />))
        }
        </section>
      </shelf>
    );
  }
}

const mapStateToProps = state => ({
  loadingPage: state.journalReducer.loadingPage,
  baseURL: state.appReducer.launchParams.BASEURL,
});

Shelf.propTypes = {
  baseURL: PropTypes.string.isRequired,
  loadingPage: PropTypes.bool,
  category: PropTypes.string,
  videos: PropTypes.arrayOf(PropTypes.object),
  onVideoHighlight: PropTypes.func.isRequired,
  onVideoSelection: PropTypes.func.isRequired,
  onVideoPlay: PropTypes.func.isRequired,
  getCategoryPage: PropTypes.func.isRequired,
};

Shelf.defaultProps = {
  loadingPage: false,
  category: '',
  videos: [],
};

export default connect(mapStateToProps)(Shelf);
