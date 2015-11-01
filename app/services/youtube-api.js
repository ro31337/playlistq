import Ember from 'ember';

export default Ember.Service.extend({
  setup() {
    var url = 'https://www.youtube.com/iframe_api';

    return new Ember.RSVP.Promise(function(resolve) {
      window.onYouTubeIframeAPIReady = resolve;
      $.getScript(url);
    });
  }
});
