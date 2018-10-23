import axios from 'axios';

// Action Types
export const REQUESTING_JOURNAL = 'REQUESTING_JOURNAL';
export const RECEIVED_JOURNAL = 'RECEIVED_JOURNAL';
export const REQUESTING_JOURNAL_PAGE = 'REQUESTING_JOURNAL_PAGE';
export const RECEIVED_JOURNAL_PAGE = 'RECEIVED_JOURNAL_PAGE';

export const JOURNAL_PAGE_SIZE = 20;
const JOURNAL_LATEST = 'Latest';
const JOURNAL_CATEGORIES = [
  JOURNAL_LATEST,
  'Instruction',
  'Lifestyle',
  'Nutrition',
  'Workouts',
  'Business',
  'News',
  'Games',
  'Podcast',
];

// Action Creators
export function journalRequesting() {
  return { type: REQUESTING_JOURNAL };
}

export function journalPageRequesting() {
  return { type: REQUESTING_JOURNAL_PAGE };
}

// Denormalize the videos to allow for id-based lookups later
function denormalizeVideos(videos) {
  const videosById = {};
  Object
    .values(videos)
    .forEach(videoByCategory => videoByCategory.reduce((currentResults, video) => {
      currentResults[video.id] = video; // eslint-disable-line no-param-reassign
      return currentResults;
    }, videosById));
  return videosById;
}

export function journalReceived(data) {
  const videosById = denormalizeVideos(data);

  return {
    type: RECEIVED_JOURNAL,
    data,
    byId: videosById,
  };
}

export function journalPageReceived(category, data) {
  const videosById = denormalizeVideos(data);

  return {
    type: RECEIVED_JOURNAL_PAGE,
    category,
    data,
    byId: videosById,
  };
}

function getJournalURL(pageNum = 1, pageSize = JOURNAL_PAGE_SIZE) {
  return `https://journal.crossfit.com/media-api/api/v1/media/journal?sort=-publishingDate&per-page=${pageSize}&page=${pageNum}&basic-filter=hasMediaType%3Dvideos`;
}

function getJournalPage(category = JOURNAL_LATEST, pageNum = 1) {
  const urlBase = getJournalURL(pageNum);
  const categoryParam = category !== JOURNAL_LATEST ? `%26tags%3D${category}` : '';
  return axios.get(`${urlBase}${categoryParam}`)
    .then(response => ({ [`${category}`]: response.data }));
}


export function fetchCategoryPage(category, pageNum) {
  return (dispatch) => {
    dispatch(journalPageRequesting());

    getJournalPage(category, pageNum)
      .then(data => dispatch(journalPageReceived(category, data)));
  };
}

export function fetchJournal() {
  return (dispatch) => {
    dispatch(journalRequesting());

    Promise.all(JOURNAL_CATEGORIES.map(category => getJournalPage(category)))
      .then(data => Object.assign({}, ...data)) // Merge all the keys onto one object
      .then(data => dispatch(journalReceived(data)));
  };
}
