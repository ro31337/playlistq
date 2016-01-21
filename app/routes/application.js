import Ember from 'ember';

export default Ember.Route.extend({
  googleApi: Ember.inject.service(),
  youtubeApi: Ember.inject.service(),

  beforeModel() {
    return Ember.RSVP.all([
        this.get('youtubeApi').setup(),
        this.get('googleApi').setup()
    ]);
  },

  actions: {
    addVideo(videoId, title, image) {
      let playlist = this.controller.get('playlist');
      let video = this.store.createRecord('video', {
        videoId: videoId,
        title: title,
        image: image,
      });

      if (!playlist) {
        playlist = this.store.createRecord('playlist');
      }

      playlist.get('videos').then(videos => {
        let previousVideo = videos.get('lastObject');
        videos.addObject(video);
        video.save().then(video => {
          if (previousVideo) {
            // Maintain link list used to determine what video to play next.
            previousVideo.set('nextVideo', video);
            previousVideo.save();
          } else {
            // No previous video means videos list is empty.
            playlist.set('currentVideo', video);
          }
          playlist.save();
        });
      });

      this.transitionTo('playlist', playlist);
    },

    search(query, pageToken) {
      this.transitionTo('search', {
        queryParams: {
          query: query,
          // Bug? pageToken === undefined routes to ?pageToken=undefined
          pageToken: pageToken || null
        }
      });
    }
  }
});
