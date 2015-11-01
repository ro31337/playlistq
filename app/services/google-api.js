import Ember from 'ember';

export default Ember.Service.extend({
  setup() {
    var url = 'https://apis.google.com/js/client.js?onload=handleGAPILoad';

    return new Ember.RSVP.Promise(function(resolve) {
      window.handleGAPILoad = function() {
        gapi.client.setApiKey('AIzaSyAQAsKse44IZRbqHWeKq3WyBxyTApbZNNQ');
        gapi.client.load('youtube', 'v3', resolve);
      };

      $.getScript(url);
    });
  }
});
