import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

const log = debug('app:MenuBar');

function MenuBar(props) {
  log('render: %O', props);

  return (
    <document>
      <menuBarTemplate>
        <menuBar>
          <menuItem route="journal">
            <title>
            JOURNAL
            </title>
          </menuItem>
        </menuBar>
      </menuBarTemplate>
    </document>
  );
}

export default connect()(MenuBar);
