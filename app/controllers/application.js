import Ember from 'ember';

export default Ember.Controller.extend({
  playlistController: Ember.inject.controller('playlist'),
  playlist: Ember.computed.reads('playlistController.model'),
});
