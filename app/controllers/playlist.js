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
        });
        playlist.save().then(() => {
          this.syncPlayerTime();
        });
      } else if (player.get('isPaused')) {
        playlist.set('state', 'paused')
        playlist.save();
      } else if (player.get('isEnded')) {
        playlist.setNextVideo().then(() => {
          playlist.save().then(() => {
            player.playVideo();
          });
        });
      }
    }
  }),

  setCurrentVideo: Ember.observer('model.currentVideo.videoId', function() {
    let videoId = this.get('model.currentVideo.videoId');
    let player = this.get('youtubeApi.player');

    if (videoId && player.get('data.video_id') !== videoId) {
      player.cueVideoById({videoId: videoId});
    }
  }),

  actions: {
    setCurrentVideo(video) {
      this.get('model').set('currentVideo', video);
      this.get('model').save();
    }
  }
});
