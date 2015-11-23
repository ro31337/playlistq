import Ember from 'ember';
import LRU from 'npm:lru-cache';

export default Ember.Route.extend({
  queryParams: {
    query: {
      refreshModel: true
    }
  },

  cache: LRU({
    // Cache max 500 queries.
    max: 500,
    // Expire cached query+response after 10 minutes.
    maxAge: 1000 * 60 * 10
  }),

  model(params) {
    if (!params.query) {
      return [];
    }

    let query = this.cleanQuery(params.query);
    let cached = this.cache.get(query);

    if (cached) {
      return cached
    }

    let request = window.gapi.client.youtube.search.list({
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 6,
    });

    return new Ember.RSVP.Promise(resolve => {
      request.execute(response => {
        this.cache.set(query, response);
        resolve(response);
      });
    });
  },

  // Remove extraneous characters from a query to increase the likelyhood of
  // hitting the cache. Premature optimization? Mistakes are the best way to
  // learn!
  cleanQuery(query) {
    return query.trim().toLowerCase().split(/[\s,.]+/).join(' ');
  }
});
