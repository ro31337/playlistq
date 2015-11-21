import Ember from 'ember';

export default Ember.Controller.extend({
  // Match local player time with global player time.
  // TODO: Sync client clocks with server clock.
  syncLocalPlayerTime() {
    let startTime = this.get('player.startTime');
    let localPlayer = this.get('localPlayer');
    let currentTime = Date.now() - startTime;

    if (currentTime >= 0) {
      localPlayer.get('player').seekTo(currentTime / 1000);
      localPlayer.get('player').unMute();
    } else {
      let syncPid = Ember.run.later(() => {
        localPlayer.get('player').seekTo(1);
        localPlayer.get('player').unMute();
      }, -currentTime);
      this.set('syncPid', syncPid);
    }
  },

  // Match local player state with global player state.
  syncLocalPlayerState: Ember.observer('player.state', function() {
    let player = this.get('player');
    let localPlayer = this.get('localPlayer');

    if (player.get('state') !== localPlayer.get('state')) {
      if (player.get('isPlaying')) {
        localPlayer.get('player').mute();
        localPlayer.get('player').playVideo();
        this.syncLocalPlayerTime();
      } else if (player.get('isPaused')) {
        localPlayer.get('player').pauseVideo();
      }
    }
  }),

  // Match global player state with local player time.
  syncGlobalPlayerState: Ember.observer('localPlayer.state', function() {
    let player = this.get('player');
    let localPlayer = this.get('localPlayer');

    if (player.get('state') !== localPlayer.get('state')) {
      if (localPlayer.get('isPlaying')) {
        localPlayer.get('player').mute();
        player.setProperties({
          state: 'playing',
          startTime: Date.now() + 1000
        }).save().then(() => {
          this.syncLocalPlayerTime();
        });
      } else if (localPlayer.get('isPaused')) {
        player.set('state', 'paused').save();
      }
    }
  }),
});
