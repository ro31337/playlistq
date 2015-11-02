import Ember from 'ember';

export default Ember.Controller.extend({
  onPlayerReady() {
    debugger;
  },

  actions: {
    play() {
      var player = new YT.Player('player', {
        videoId: 'M7lc1UVf-VE',
        events: {
          'onReady': function() {
          }
        }
      });
      this.set('player', player);
    }
  }
});
