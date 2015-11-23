import Ember from 'ember';
import LocalPlayer from '../objects/local-player';

export default Ember.Service.extend({
  setup() {
    var url = 'https://www.youtube.com/iframe_api';

    return new Ember.RSVP.Promise(function(resolve) {
      window.onYouTubeIframeAPIReady = resolve;
      $.getScript(url);
    });
  },

  player: Ember.computed(function() {
    return LocalPlayer.create();
  })
});
