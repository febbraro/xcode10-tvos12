import axios from 'axios';

// Action Types
export const REQUESTING_VIDEO = 'REQUESTING_VIDEO';
export const SUCCESSFUL_VIDEO = 'SUCCESSFUL_VIDEO';
export const FAILED_VIDEO = 'FAILED_VIDEO';

// Action Creators
export function videoRequesting() {
  return { type: REQUESTING_VIDEO };
}

export function videoSuccessful(data) {
  return {
    type: SUCCESSFUL_VIDEO,
    data,
  };
}

export function videoFailed() {
  return { type: FAILED_VIDEO };
}

export function fetchVideo(slug) {
  return (dispatch) => {
    dispatch(videoRequesting());

    axios.get(`https://journal.crossfit.com/media-api/api/v1/media/slug/${slug}`)
      .then(response => response.data)
      .then(data => dispatch(videoSuccessful(data)));
  };
}
