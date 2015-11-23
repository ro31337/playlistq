import Ember from 'ember';

export default Ember.Controller.extend({
  youtubeApi: Ember.inject.service(),

  // Match playlist time with player time.
  // TODO: Sync client clocks with server clock.
  syncPlayerTime() {
    let startTime = this.get('model.startTime');
    let player = this.get('youtubeApi.player');
    let currentTime = Date.now() - startTime;

    if (currentTime >= 0) {
      player.seekTo(currentTime / 1000);
      player.unMute();
    } else {
      let syncPid = Ember.run.later(() => {
        player.seekTo(0);
        player.unMute();
      }, -currentTime);
      this.set('syncPid', syncPid);
    }
  },

  // Match player state with playlist state.
  syncPlayerState: Ember.observer('model.state', function() {
    let playlist = this.get('model');
    let player = this.get('youtubeApi.player');

    if (playlist.get('state') !== player.get('state')) {
      if (playlist.get('isPlaying')) {
        player.mute();
        player.playVideo();
        this.syncPlayerTime();
      } else if (playlist.get('isPaused')) {
        player.pauseVideo();
      }
    }
  }),

  // Match playlist state with player state.
  syncGlobalPlayerState: Ember.observer('youtubeApi.player.state', function() {
    let playlist = this.get('model');
    let player = this.get('youtubeApi.player');

    if (playlist.get('state') !== player.get('state')) {
      if (player.get('isPlaying')) {
        player.mute();
        playlist.setProperties({
          state: 'playing',
          startTime: Date.now() + 1000
        }).save().then(() => {
          this.syncPlayerTime();
        });
      } else if (player.get('isPaused')) {
        playlist.set('state', 'paused').save();
      }
    }
  }),

  setCurrentVideo: Ember.observer('model.currentVideoId', function() {
    let videoId = this.get('model.currentVideoId');
    let player = this.get('youtubeApi.player');

    if (videoId && player.get('data.video_id') !== videoId) {
      player.cueVideoById({videoId: videoId});
    }
  }),

  actions: {
    setCurrentVideo(videoId) {
      this.get('model').set('currentVideoId', videoId).save();
    }
  }
});
