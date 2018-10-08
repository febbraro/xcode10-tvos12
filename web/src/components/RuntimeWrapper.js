import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import store from '../store/configureStore';

export default function RuntimeWrapper(props) {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}

RuntimeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
