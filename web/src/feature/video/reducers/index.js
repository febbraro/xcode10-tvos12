import {
  REQUESTING_VIDEO,
  SUCCESSFUL_VIDEO,
  FAILED_VIDEO,
} from '../actions';

const defaultState = {
  loading: true,
  video: null,
};

export default function videoReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case REQUESTING_VIDEO:
      return defaultState;
    case SUCCESSFUL_VIDEO:
      return {
        ...state,
        loading: false,
        invalid: false,
        video: action.data,
      };
    case FAILED_VIDEO:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
