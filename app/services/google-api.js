import Ember from 'ember';

export default Ember.Service.extend({
  setup() {
    var url = 'https://apis.google.com/js/client.js?onload=handleGAPILoad';

    return new Ember.RSVP.Promise(function(resolve) {
      window.handleGAPILoad = function() {
        window.gapi.client.setApiKey('AIzaSyAQAsKse44IZRbqHWeKq3WyBxyTApbZNNQ');
        window.gapi.client.load('youtube', 'v3', resolve);
      };

      $.getScript(url);
    });
  },

  suggestUrl: "http://suggestqueries.google.com/complete/search",

  suggest(query) {
    return new Ember.RSVP.Promise(function(resolve, error) {
      $.getJSON(this.suggestUrl, {
        ds: 'yt',
        client: 'youtube',
        q: query
      }, resolve, error);
    });
  }
});
