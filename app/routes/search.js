import Ember from 'ember';
import LRU from 'npm:lru-cache';

export default Ember.Route.extend({
  queryParams: {
    query: {
      refreshModel: true
    },
    pageToken: {
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
    let cacheKey = this.getCacheKey(query, params.pageToken);
    let cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    let request = window.gapi.client.youtube.search.list({
      q: query,
      part: 'snippet',
      type: 'video',
      pageToken: params.pageToken,
      maxResults: 6,
    });

    return new Ember.RSVP.Promise(resolve => {
      request.execute(response => {
        this.cache.set(cacheKey, response);
        resolve(response);
      });
    });
  },

  // Remove extraneous characters from a query to increase the likelyhood of
  // hitting the cache. Premature optimization? Mistakes are the best way to
  // learn!
  cleanQuery(query) {
    return query.trim().toLowerCase().split(/[\s,.]+/).join(' ');
  },

  // Generate a key for the LRU cache based on the query and page.
  getCacheKey(query, pageToken) {
    if (pageToken) {
      return `${ query }-${ pageToken }`;
    }
    return query;
  }
});
