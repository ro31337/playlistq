import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  isLoaded: false,
  isPaused: Ember.computed.equal('state', 'paused'),
  isPlaying: Ember.computed.equal('state', 'playing'),
  isEnded: Ember.computed.equal('state', 'ended'),
  isBuffering: Ember.computed.equal('state', 'buffering'),
  isCued: Ember.computed.equal('state', 'cued'),

  videoIdObserver: Ember.observer('videoId', function() {
    let videoId = this.get('videoId');
    if (videoId) {
      this.set('isLoaded', false);

      let player = new YT.Player('player', {
        videoId: videoId,
        events: {
          onReady: this._onReady.bind(this),
          onStateChange: this._onStateChange.bind(this),
        }
      });

      this.set('player', player);
    }
  }).on('init'),

  _onReady() {
    this.set('isLoaded', true);
    this.trigger('didLoad', this);
  },

  _onStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      this.set('state', 'ended');
    } else if (event.data === YT.PlayerState.PLAYING) {
      this.set('state', 'playing');
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.set('state', 'paused');
    } else if (event.data === YT.PlayerState.BUFFERING) {
      this.set('state', 'buffering');
    } else if (event.data === YT.PlayerState.CUED) {
      this.set('state', 'cued');
    }
  }
});
