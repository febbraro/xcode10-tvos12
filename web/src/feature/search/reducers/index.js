import {
  SEARCH_UPDATE,
  SEARCH_RESULTS_REQUEST,
  SEARCH_RESULTS_SUCCESS,
  SEARCH_RESULTS_FAILURE,
  SEARCH_PAGE_REQUEST,
  SEARCH_PAGE_SUCCESS,
  SEARCH_PAGE_FAILURE,
} from '../actions';

const defaultState = {
  loading: false,
  error: false,
  search: '',
  query: '',
  results: {
    items: [],
    total: 0,
    page: 1,
  },
};

export default function searchReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case SEARCH_UPDATE:
      return {
        ...state,
        search: action.search,
      };
    case SEARCH_RESULTS_REQUEST: {
      return {
        ...state,
        query: action.query,
        results: defaultState.results,
        loading: true,
        error: false,
      };
    }
    case SEARCH_RESULTS_SUCCESS: {
      return {
        ...state,
        results: action.results,
        loading: false,
        error: false,
      };
    }
    case SEARCH_RESULTS_FAILURE:
      return {
        ...state,
        results: defaultState.results,
        loading: false,
        error: true,
      };
    case SEARCH_PAGE_REQUEST: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }
    case SEARCH_PAGE_SUCCESS: {
      const newState = {
        ...state,
        loading: false,
        error: false,
      };

      // Only add the results if they are for the next page
      if (action.results.page === state.results.page + 1) {
        newState.results.page = action.results.page;
        newState.results.total = action.results.total;
        newState.results.items = state.results.items.concat(action.results.items);
      }

      return newState;
    }
    case SEARCH_PAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
}
