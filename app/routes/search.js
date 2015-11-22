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

    let request = window.gapi.client.youtube.search.list({
      q: params.query,
      part: 'snippet',
      type: 'video',
      maxResults: 6,
    });

    return new Ember.RSVP.Promise(resolve => {
      request.execute(response => {
        resolve(response);
      });
    });
  }
});
