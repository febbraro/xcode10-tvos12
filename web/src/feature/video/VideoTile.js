import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import gradient from '../../assets/gradient.png';
import premiumStar from '../../assets/premium2.png';

function VideoTile(props) {
  const { video } = props;

  const premium = video.isPaid ? premiumStar : '';

  console.log(props);
  console.log(video);

  return (
    <lockup data-category={props.category} data-videoId={video.id}>
      <img class="img" src={video.media.thumbnail} width="375" height="205" />
      <overlay>
        {/* <background>
          <img src={`${props.baseURL}${gradient}`} width="400" height="250" />
        </background> */}
        <img class="premium subscribed" src={`${props.baseURL}${premium}`} />
      </overlay>
      <text class={`title ${props.titleColor}`} style={{ fontSize: 30, tvTextMaxLines: 2 }}>
        {video.title}
      </text>
    </lockup>
  );
}


const mapStateToProps = state => ({
  baseURL: state.appReducer.launchParams.BASEURL,
});

VideoTile.propTypes = {
  baseURL: PropTypes.string.isRequired,
  category: PropTypes.string,
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isPaid: PropTypes.bool,
    media: PropTypes.object.isRequired,
  }).isRequired,
  titleColor: PropTypes.string,
};

VideoTile.defaultProps = {
  category: '',
  titleColor: 'black',
};

export default connect(mapStateToProps)(VideoTile);
