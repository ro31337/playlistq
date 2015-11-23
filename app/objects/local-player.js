import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  isReady: false,
  isPaused: Ember.computed.equal('state', 'paused'),
  isPlaying: Ember.computed.equal('state', 'playing'),
  isEnded: Ember.computed.equal('state', 'ended'),
  isBuffering: Ember.computed.equal('state', 'buffering'),
  isCued: Ember.computed.equal('state', 'cued'),
  proxyMethods: [
    'cueVideoById', 'pauseVideo', 'playVideo', 'mute', 'seekTo', 'unMute'],

  initPlayer: function() {
    this.set('player', new YT.Player('player', {
      events: {
        onReady: this._onReady.bind(this),
        onStateChange: this._onStateChange.bind(this),
      }
    }));
  }.on('init'),

  promise: Ember.computed(function() {
    return new Ember.RSVP.Promise(resolve => {
      if (this.get('isReady')) {
        resolve(player)
      } else {
        this.one('didReady', resolve);
      }
    });
  }),

  data: Ember.computed('isReady', 'state', function() {
    let player = this.get('player');
    return player.getVideoData && player.getVideoData();
  }),

  _onReady() {
    this._proxyMethods();
    this.set('isReady', true);
    this.trigger('didReady', this);
  },

  _proxyMethods() {
    let player = this.get('player');
    this.get('proxyMethods').forEach(method => {
      this[method] = player[method].bind(player);
    });
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
    } else {
      this.set('state', undefined);
    }
  }
});
