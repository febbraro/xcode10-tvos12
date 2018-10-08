import React from 'react';
import * as TVDML from 'tvdml';
import debug from 'debug';

import store from './store/configureStore';
import {
  launchApp,
  resumeApp,
  suspendApp,
} from './feature/app/actions';

import RuntimeWrapper from './components/RuntimeWrapper';
import { showMessageFactory } from './utils';

import MenuBar from './feature/app/MenuBar';
import Journal from './feature/journal/Journal';
import Video from './feature/video/Video';

// Attach debug to the global App scope so we can access it via the
// Dev Console and configure logging directly. e.g. App.debug.enable('*')
App.debug = debug;

TVDML
  .subscribe(TVDML.event.LAUNCH)
  .pipe(TVDML.render(() => (
    <RuntimeWrapper>
      <MenuBar />
    </RuntimeWrapper>
  )));

TVDML
  .subscribe(TVDML.event.LAUNCH)
  .pipe(payload => store.dispatch(launchApp(payload)));

TVDML
  .subscribe(TVDML.event.SUSPEND)
  .pipe(() => store.dispatch(suspendApp()));

TVDML
  .subscribe(TVDML.event.RESUME)
  .pipe(() => store.dispatch(resumeApp()));

TVDML
  .handleRoute('journal')
  .pipe(TVDML.render(() => (
    <RuntimeWrapper>
      <Journal />
    </RuntimeWrapper>
  )));

TVDML
  .handleRoute('video')
  .pipe(TVDML.render(payload => (
    <RuntimeWrapper>
      <Video slug={payload.navigation} />
    </RuntimeWrapper>
  )));

// Handle the 404
TVDML
  .handleRoute(TVDML.route.NOT_FOUND)
  .pipe(showMessageFactory('Page Not Found'));
