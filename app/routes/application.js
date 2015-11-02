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
    // Why doesn't the Youtube video show, if called `play` action is triggered
    // immediately?
    Ember.run.next(controller, 'send', 'play');
  }
});
