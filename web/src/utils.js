import React from 'react';
import * as TVDML from 'tvdml';

export function showMessagePipeline(message) {
  return TVDML.renderModal(() => (
    <document>
      <alertTemplate>
        <title>
          {message}
        </title>
        <button onSelect={TVDML.removeModal}>
          <text>
Close
          </text>
        </button>
      </alertTemplate>
    </document>
  ));
}

export function showMessageFactory(message) {
  return () => showMessagePipeline(message).sink();
}

export function link(route, params) {
  return () => TVDML.navigate(route, params);
}

// When finding video we want to default to a max resolution, but if that
// resolution does not exist within that video, we need to fallback to the
// next highes resolution
export function findVideoSource(sources, resolution = '1080p') {
  const allResolutions = ['4k', '1080p', '720p', '480p', '360p', '240p'];
  const usableResolutions = allResolutions.includes(resolution)
    ? allResolutions.slice(allResolutions.indexOf(resolution))
    : [];
  return sources.find(s => usableResolutions.includes(s.label));
}
