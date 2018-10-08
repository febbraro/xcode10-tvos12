import {
  ACTIVE,
  LOADING,
  SUSPENDED,
  APP_LAUNCH,
  APP_SUSPEND,
  APP_RESUME,
} from '../actions';

const defaultState = {
  state: LOADING,
  launchParams: null,
};

export default function appReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case APP_LAUNCH:
      return {
        ...state,
        state: ACTIVE,
        launchParams: action.params,
      };
    case APP_SUSPEND:
      return {
        ...state,
        state: SUSPENDED,
      };
    case APP_RESUME:
      return {
        ...state,
        state: ACTIVE,
      };
    default:
      return state;
  }
}
