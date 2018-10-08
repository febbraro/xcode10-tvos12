// Action Types
export const REQUESTING_JOURNAL = 'REQUESTING_JOURNAL';
export const RECEIVED_JOURNAL = 'RECEIVED_JOURNAL';
export const REQUESTING_JOURNAL_PAGE = 'REQUESTING_JOURNAL_PAGE';
export const RECEIVED_JOURNAL_PAGE = 'RECEIVED_JOURNAL_PAGE';
export const INVALIDATE_JOURNAL = 'INVALIDATE_JOURNAL';
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

export function journalInvalidate() {
  return { type: INVALIDATE_JOURNAL };
}

export function fetchJournal() {
  return (dispatch) => {
    dispatch(journalRequesting());

    const data = {
      Latest: [
        {
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
        },
      ],
    };
    dispatch(journalReceived(data));
  };
}


// { 
//   "id": "m20181003201423", 
//   "title": "The Great Escape ", 
//   "slug": "the-great-escape", 
//   "type": "article", 
//   "feeds": ["mainsite", "journal"], 
//   "publishedOn": "2018-10-08T00:09:08+0000", 
//   "publishingState": "published", 
//   "publishingDate": "2018-10-08T00:00:00+00:00", 
//   "subscriptionLevel": "free", 
//   "location": null, 
//   "tags": ["lifestyle", "pregnant", "parent", "death", "recovery", "therapy", "family", "community", "affiliate", "coach"], 
//   "language": "en", 
//   "translations": { "en": "m20181003201423" }, 
//   "people": ["Torin Simpson"], 
//   "sharable": null, 
//   "topicId": "media.m20181003201423", 
//   "summaryRaw": "Jeremy and Allison Schwartz heal after tragedy.", 
//   "summaryHtml": "<p>Jeremy and Allison Schwartz heal after tragedy.<\/p>", 
//   "featuredContent": false, 
//   "isArticle": true, 
//   "isFree": true, 
//   "postRaw": "Jeremy and Allison Schwartz are members of [Maxability Sports and CrossFit](http:\/\/maxability.net\/){target=_blank} in Teaneck, New Jersey. \r\n\r\nOn the same day Allison started CrossFit, she found out she was pregnant. She didn\u2019t continue with CrossFit during her pregnancy but intended to return to the affiliate after the baby was born. \r\n\r\n\"Overall, I felt great,\" Allison says of her pregnancy. \"I just felt good. I just felt like 'this is what I\u2019m supposed to be doing.'\"\r\n\r\nJust four days before her due date, Allison and Jeremy received devastating news: Their baby had died in utero. \r\n\r\nAfter delivering a stillborn baby boy, Allison spent six weeks on the couch trying to recover from the mental and physical stress of labor and delivery.\r\n\r\n\"Your body physically doesn\u2019t know that you didn\u2019t come home with a baby,\" Allison says through tears, \"so you still have all the physical symptoms of going through labor.\"\r\n\r\nTwo months after the loss, Allison returned to CrossFit, which became part of her healing process. \r\n\r\n\"I think CrossFit helped Ali\u2014in a time where you could feel like you\u2019re in such despair\u2014provide an outlet where you physically have to be strong,\" Jeremy says.\r\n\r\nAllison agrees: \"It felt so good to finally gain confidence in myself physically again. \u2026 It\u2019s been so helpful.\"\r\n\r\n**Additional reading:** [\"Enemy Unseen\"](https:\/\/journal.crossfit.com\/article\/enemy-unseen-2){target=_blank}", "postHtml": "<p>Jeremy and Allison Schwartz are members of <a href=\"http:\/\/maxability.net\/\" title=\"\" target=\"_blank\">Maxability Sports and CrossFit<\/a> in Teaneck, New Jersey.<p>On the same day Allison started CrossFit, she found out she was pregnant. She didn&rsquo;t continue with CrossFit during her pregnancy but intended to return to the affiliate after the baby was born.<\/p><p>\"Overall, I felt great,\" Allison says of her pregnancy. \"I just felt good. I just felt like 'this is what I&rsquo;m supposed to be doing.'\"<\/p><p>Just four days before her due date, Allison and Jeremy received devastating news: Their baby had died in utero.<\/p><p>After delivering a stillborn baby boy, Allison spent six weeks on the couch trying to recover from the mental and physical stress of labor and delivery.<\/p><p>\"Your body physically doesn&rsquo;t know that you didn&rsquo;t come home with a baby,\" Allison says through tears, \"so you still have all the physical symptoms of going through labor.\"<\/p><p>Two months after the loss, Allison returned to CrossFit, which became part of her healing process.<\/p><p>\"I think CrossFit helped Ali&mdash;in a time where you could feel like you&rsquo;re in such despair&mdash;provide an outlet where you physically have to be strong,\" Jeremy says.<\/p><p>Allison agrees: \"It felt so good to finally gain confidence in myself physically again. &hellip; It&rsquo;s been so helpful.\"<\/p><p><strong>Additional reading:<\/strong> <a href=\"https:\/\/journal.crossfit.com\/article\/enemy-unseen-2\" title=\"\" target=\"_blank\">\"Enemy Unseen\"<\/a><\/p><\/p>\n", 
// }