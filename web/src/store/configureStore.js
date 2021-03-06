import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import appReducer from '../feature/app/reducers';
import journalReducer from '../feature/journal/reducers';
import videoReducer from '../feature/video/reducers';
import searchReducer from '../feature/search/reducers';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
  appReducer,
  journalReducer,
  videoReducer,
  searchReducer,
});

const middleware = [
  thunkMiddleware,
  loggerMiddleware,
];

export default createStore(
  rootReducer,
  applyMiddleware(...middleware),
);
