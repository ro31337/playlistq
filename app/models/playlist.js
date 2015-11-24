import DS from 'ember-data';

export default DS.Model.extend({
  videos: DS.hasMany('video', { async: true }),
  state: DS.attr('string'),
  startTime: DS.attr('number'),
  currentVideo: DS.belongsTo('video', { async: true }),
  isPaused: Ember.computed.equal('state', 'paused'),
  isPlaying: Ember.computed.equal('state', 'playing'),
  isEnded: Ember.computed.equal('state', 'ended'),
  isBuffering: Ember.computed.equal('state', 'buffering'),
  isCued: Ember.computed.equal('state', 'cued'),

  // Set `currentVideo` to `currentVideo.nextVideo`. Return's a promise that
  // resolves when `currentVideo` and `currentVideo.nextVideo` are loaded.
  setNextVideo() {
    return this.get('currentVideo').then(currentVideo => {
      if (currentVideo.get('nextVideo')) {
        return currentVideo.get('nextVideo').then(nextVideo => {
          return this.set('currentVideo', nextVideo);
        });
      }
    });
  }
});
