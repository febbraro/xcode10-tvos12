import {
  REQUESTING_JOURNAL,
  RECEIVED_JOURNAL,
} from '../actions';

const defaultState = {
  loading: true,
  videos: {
    categories: {},
  },
};

export default function journalReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case REQUESTING_JOURNAL:
      return {
        ...state,
        loading: true,
      };
    case RECEIVED_JOURNAL:
      return {
        ...state,
        loading: false,
        isInvalid: false,
        videos: {
          categories: {
            ...action.data,
          },
          byId: action.byId,
        },
      };
    default:
      return state;
  }
}
