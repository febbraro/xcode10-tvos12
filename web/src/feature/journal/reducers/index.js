import {
  REQUESTING_JOURNAL,
  RECEIVED_JOURNAL,
  REQUESTING_JOURNAL_PAGE,
  RECEIVED_JOURNAL_PAGE,
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
    case REQUESTING_JOURNAL_PAGE:
      return {
        ...state,
        loadingPage: true,
      };
    case RECEIVED_JOURNAL_PAGE: {
      const { category, data, byId } = action;
      const videos = state.videos.categories[category].concat(data[category]);
      const newById = Object.assign(state.videos.byId, byId);
      return {
        ...state,
        loadingPage: false,
        videos: {
          categories: {
            ...state.videos.categories,
            [category]: videos,
          },
          byId: newById,
        },
      };
    }
    default:
      return state;
  }
}
