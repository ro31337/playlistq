import Ember from 'ember';

export default Ember.Route.extend({
  googleApi: Ember.inject.service(),
  youtubeApi: Ember.inject.service(),

  beforeModel() {
    return Ember.RSVP.all([
        this.get('googleApi').setup(),
        this.get('youtubeApi').setup(),
    ]);
  }
});
