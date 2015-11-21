import DS from 'ember-data';

export default DS.Model.extend({
  state: DS.attr('string'),
  startTime: DS.attr('number'),
  video: DS.belongsTo('video', { async: true }),
  isPaused: Ember.computed.equal('state', 'paused'),
  isPlaying: Ember.computed.equal('state', 'playing'),
  isEnded: Ember.computed.equal('state', 'ended'),
  isBuffering: Ember.computed.equal('state', 'buffering'),
  isCued: Ember.computed.equal('state', 'cued')
});
