import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Loader(props) {
  const { title } = props;

  return (
    <document>
      <loadingTemplate>
        <activityIndicator>
          { title && (
          <title>
            {title}
          </title>
          ) }
        </activityIndicator>
      </loadingTemplate>
    </document>
  );
}

const mapStateToProps = state => ({
  baseURL: state.appReducer.launchParams.BASEURL,
});

Loader.propTypes = {
  title: PropTypes.string,
};

Loader.defaultProps = {
  title: 'Loading...',
};

export default connect(mapStateToProps)(Loader);
