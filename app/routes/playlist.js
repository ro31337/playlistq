import Ember from 'ember';
import LocalPlayer from '../objects/local-player';

export default Ember.Route.extend({
  model(params) {
    if (params.playlist_id) {
      let playlist = this.store.find('playlist', params.playlist_id);
      let player = playlist.then(playlist => {
        return playlist.get('player');
      });

      let localPlayer = new Ember.RSVP.Promise(resolve => {
        player.then(player => {
          player.get('video').then(video => {
            LocalPlayer.create({
              videoId: video.get('videoId')
            }).one('didLoad', resolve);
          });
        });
      });

      return new Ember.RSVP.hash({
        playlist: playlist,
        player: player,
        localPlayer: localPlayer
      });
    }
  },

  setupController(controller, models) {
    if (models) {
      controller.setProperties({
        playlist: models.playlist,
        player: models.player,
        localPlayer: models.localPlayer
      });
    }
  }
});
