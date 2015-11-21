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

  setupController(controller) {
    Playlistq.store = this.store;
    Playlistq.controller = controller;
    this.store.findAll('playlist', { limit: 1 }).then(playlists => {
      Ember.run.later(() => {
        this.transitionTo('playlist', playlists.get('lastObject.id'));
      }, 1000);
    });
  },

  actions: {
    addVideo(videoId, title, image) {
      let player,
          playlist = this.controller.get('playlist'),
          video = this.store.createRecord('video', {
            videoId: videoId,
            title: title,
            image: image,
          });

      if (!playlist) {
        playlist = this.store.createRecord('playlist');
        player = this.store.createRecord('player');
        playlist.set('player', player);
        player.set('video', video);
      }

      playlist.get('videos').then(videos => {
        videos.addObject(video);
        video.save().then(() => {
          if (player) {
            player.save().then(() => {
              playlist.save();
            });
          } else {
            playlist.save();
          }
        });
      });

      this.transitionTo('playlist', playlist);
    },

    search(query) {
      this.transitionTo('search', {queryParams: {query: query}});
    }
  }
});
