import DS from 'ember-data';

export default DS.Model.extend({
  videos: DS.hasMany('video', { async: true }),
  state: DS.attr('string'),
  startTime: DS.attr('number'),
  currentVideoId: DS.attr('string'),
  isPaused: Ember.computed.equal('state', 'paused'),
  isPlaying: Ember.computed.equal('state', 'playing'),
  isEnded: Ember.computed.equal('state', 'ended'),
  isBuffering: Ember.computed.equal('state', 'buffering'),
  isCued: Ember.computed.equal('state', 'cued'),
});
