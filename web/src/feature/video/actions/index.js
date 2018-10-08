// Action Types
export const REQUESTING_VIDEO = 'REQUESTING_VIDEO';
export const SUCCESSFUL_VIDEO = 'SUCCESSFUL_VIDEO';
export const FAILED_VIDEO = 'FAILED_VIDEO';
export const INVALIDATE_VIDEO = 'INVALIDATE_VIDEO';

// Action Creators
export function videoRequesting() {
  return { type: REQUESTING_VIDEO };
}

export function videoSuccessful(data) {
  return {
    type: SUCCESSFUL_VIDEO,
    data,
  };
}

export function videoFailed() {
  return { type: FAILED_VIDEO };
}

export function videoInvalidate() {
  return { type: INVALIDATE_VIDEO };
}

export function fetchVideo() {
  return (dispatch) => {
    dispatch(videoRequesting());

    const video = {
      id: 'm20160623235259',
      title: 'Some Video',
      slug: 'some-ideo',
      publishingDate: '2016-06-23T23:54:02+0000',
      summaryRaw: 'This is a summary of video',
      postRaw: 'This is a video',
      people: ['Frank Febbraro'],
      media: {
        thumbnail: 'https://d1s2fu91rxnpt4.cloudfront.net/mainsite/m20181003201423/thumbnail/Title_SG.jpg',
        featuredThumbnail: 'https://d1s2fu91rxnpt4.cloudfront.net/mainsite/m20181003201423/display/Title_SG.jpg',
        items: [
          {
            isHeader: true,
            sources: [
              { url: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-1080p.mov', label: '1080p', width: 1920, height: 1080 },
              { url: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-720p.mov', label: '720p', width: 1280, height: 720, device: 'desktop' },
              { url: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-480p.mov', label: '480p', width: 854, height: 480 },
              { url: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-360p.mov', label: '360p', width: 640, height: 360, device: 'mobile' },
              { url: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-240p.mov', label: '240p', width: 352, height: 198 },
            ],
            desktop: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-720p.mov',
            mobile: 'https://d3l7mm4198npa8.cloudfront.net/free/thegreatescape_v2/thegreatescape_v2-360p.mov',
            duration: 1204,
            header: true,
            type: 'video',
          },
          {
            hasPrev: false,
            hasNext: false,
            raw: 'https://d1s2fu91rxnpt4.cloudfront.net/mainsite/m20181003201423/raw/Title_SG.jpg',
            desktop: 'https://d1s2fu91rxnpt4.cloudfront.net/mainsite/m20181003201423/display/Title_SG.jpg',
            thumbnail: 'https://d1s2fu91rxnpt4.cloudfront.net/mainsite/m20181003201423/thumbnail/Title_SG.jpg',
            mobile: 'https://d1s2fu91rxnpt4.cloudfront.net/mainsite/m20181003201423/thumbnail/Title_SG.jpg',
            isThumbnail: true,
            playButtonOverlay: false,
            isHeader: false,
            header: false,
            type: 'photo',
          },
        ],
      },
      subscriptionLevel: 'paid',
      isPaid: true,
    };

    dispatch(videoSuccessful(video));
  };
}
