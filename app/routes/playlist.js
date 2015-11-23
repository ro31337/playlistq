import Ember from 'ember';

export default Ember.Route.extend({
  youtubeApi: Ember.inject.service(),

  model(params) {
    if (params.playlist_id) {
      return this.store.find('playlist', params.playlist_id);
    }
  },

  afterModel(model) {
    return this.get('youtubeApi.player.promise');
  }
});
