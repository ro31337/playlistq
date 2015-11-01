import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: {
      refreshModel: true
    }
  },

  model(params) {
    if (!params.query) {
      return [];
    }

    var request = gapi.client.youtube.search.list({
      q: params.query,
      part: 'snippet',
      type: 'video',
      maxResults: 10,
    });

    return new Ember.RSVP.Promise(function(resolve) {
      request.execute(function(response) {
        resolve(response);
      });
    });
  }
});
