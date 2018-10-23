import axios from 'axios';

// Action Types
export const SEARCH_UPDATE = 'SEARCH_UPDATE';
export const SEARCH_RESULTS_REQUEST = 'SEARCH_RESULTS_REQUEST';
export const SEARCH_RESULTS_SUCCESS = 'SEARCH_RESULTS_SUCCESS';
export const SEARCH_RESULTS_FAILURE = 'SEARCH_RESULTS_FAILURE';
export const SEARCH_PAGE_REQUEST = 'SEARCH_PAGE_REQUEST';
export const SEARCH_PAGE_SUCCESS = 'SEARCH_PAGE_SUCCESS';
export const SEARCH_PAGE_FAILURE = 'SEARCH_PAGE_FAILURE';

// Action Creators
/**
 * Search value changes
 */
export function searchValueChange(searchVal) {
  return {
    type: SEARCH_UPDATE,
    search: searchVal,
  };
}

/**
 * Search request actions
 */
export function searchResultsRequest(query) {
  return {
    type: SEARCH_RESULTS_REQUEST,
    query,
  };
}

export function searchResultsSuccess(results) {
  return {
    type: SEARCH_RESULTS_SUCCESS,
    results,
  };
}

export function searchResultsFailure() {
  return { type: SEARCH_RESULTS_FAILURE };
}

/**
 * Search Pagination Actions
 */
export function searchPageRequest() {
  return { type: SEARCH_PAGE_REQUEST };
}

export function searchPageSuccess(results) {
  return {
    type: SEARCH_PAGE_SUCCESS,
    results,
  };
}

export function searchPageFailure() {
  return { type: SEARCH_PAGE_FAILURE };
}

function search(query, pageNum = 1, pageSize = 24) {
  const encodedQuery = encodeURIComponent(query);
  // Removed date sort. For search we want score/relevancy (default) [sort=-publishingDate]
  return axios.get(`https://journal.crossfit.com/media-api/api/v1/media/journal?search=${encodedQuery}&page=${pageNum}&per-page=${pageSize}&basic-filter=hasMediaType%3Dvideos`)
    .then((response) => { console.log(response); return response; })
    .then(response => ({
      items: response.data,
      total: parseInt(response.headers['x-total-count'], 10),
      page: parseInt(response.headers.paginationpage, 10),
    }));
}


/**
 * Loading results is a Thunk that returns an Array of:
 * 1. Dispatch loadResultsRequest()
 * 2. Returns a Promise from the actual fetch request to the API
 */
export function executeSearch(query) {
  return (dispatch) => {
    dispatch(searchResultsRequest(query));

    search(query)
      .then(results => dispatch(searchResultsSuccess(results)))
      .catch(() => dispatch(searchResultsFailure()));
  };
}

export function fetchMoreResults() {
  return (dispatch, getState) => {
    const state = getState().searchReducer;

    // Only request more results if we don't already have all of them
    if (state.results.items.length < state.results.total) {
      dispatch(searchPageRequest());

      const nextPage = state.results.page + 1;
      search(state.query, nextPage)
        .then(results => dispatch(searchPageSuccess(results)))
        .catch(() => dispatch(searchPageFailure()));
    }
  };
}

/**
 * Compose together dispatches of action when a user types
 */
export function realtimeTypeSearch(searchVal) {
  return (dispatch) => {
    dispatch(searchValueChange(searchVal));
    dispatch(executeSearch(searchVal));
  };
}
