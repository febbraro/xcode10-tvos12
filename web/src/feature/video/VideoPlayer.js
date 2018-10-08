import debug from 'debug';

const removeMarkdown = require('remove-markdown');
const removeHtml = require('striptags');

const log = debug('video:VideoPlayer');

/**
 * VideoPlayer class that consolidated using the TVMLKit Player for video
 *
 * This expects to be constructed with an object in shape of:
 *  - id (string):  Identifier used for tracking video progress
 *  - title (string): Used on the video loading and metadata screen
 *  - subtitle (string): Used on the video metadata screen
 *  - description (string): Used on the video metadata screen
 *  - url (string): The URL for the video to play
 *  - duration (int): The length of the video
 */
export default class VideoPlayer {
  constructor(data) {
    this.data = data;

    // A user could play a trailer and full version of a video, but they both have the same id
    // so we include URL in the key so any saved progress is specific to the actual version
    // of the video being watched. Otherwise, they might save a progress on a full video and if they
    // try to watch the trailer (they logged out) the progress indicator is past the end of the
    // video, this can be a problem.
    this.storageKey = `${this.data.id}-${this.data.url}`;
  }

  // Return the last progress for a video, or 0 (start) if no saved time exists
  progressForVideo() {
    return localStorage.getItem(this.storageKey) || 0;
  }

  // Save the progress of a video
  saveProgressForVideo(progress) {
    localStorage.setItem(this.storageKey, progress);
  }

  // Remove the progress of a video
  removeProgressForVideo() {
    localStorage.removeItem(this.storageKey);
  }

  // Called as time progresses on a video. If the video is over 95% played, then
  // remove progress so it will start at the beginning.
  videoTimeChanged = (event) => {
    const percentWatched = Math.trunc((event.time / this.data.duration) * 100);

    // If video is >95% finished, start from beginning.
    if (percentWatched > 95) {
      this.removeProgressForVideo();
    } else {
      this.saveProgressForVideo(event.time);
    }
  };

  play() {
    log('play()');
    log(`Video URL: ${this.data.url}`);

    const videoMedia = new MediaItem('video', this.data.url);
    videoMedia.title = this.data.title;
    videoMedia.subtitle = this.data.subtitle;
    videoMedia.description = removeMarkdown(removeHtml(this.data.description));
    videoMedia.resumeTime = this.progressForVideo(this.data.id);

    const player = new Player();
    player.playlist = new Playlist();
    player.playlist.push(videoMedia);

    player.addEventListener('timeDidChange', this.videoTimeChanged, { interval: 5 });

    player.play();
  }
}
