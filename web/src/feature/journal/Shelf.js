import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';

import VideoTile from '../video/VideoTile';
import eyebrow from '../../assets/eyebrow.png';

const log = debug('journal:Shelf');

export default function Shelf(props) {
  log('Shelf.render');
  log(props);
  return (
    <shelf
      onHighlight={props.onVideoHighlight}
    >
      <header style={{ marginBottom: 45 }}>
        <img src={`${props.baseURL}${eyebrow}`} width="80" height="40" />
        <title class="title shelf-title black">
          {props.category}
        </title>
      </header>
      <section onSelect={props.onVideoSelection} onPlay={props.onVideoPlay}>
        {
        props.videos.map(video => (<VideoTile key={video.id} video={video} category={props.category} titleColor="black" />))
      }
      </section>
    </shelf>
  );
}

Shelf.propTypes = {
  baseURL: PropTypes.string.isRequired,
  category: PropTypes.string,
  videos: PropTypes.arrayOf(PropTypes.object),
  onVideoHighlight: PropTypes.func.isRequired,
  onVideoSelection: PropTypes.func.isRequired,
  onVideoPlay: PropTypes.func.isRequired,
};

Shelf.defaultProps = {
  category: '',
  videos: [],
};
