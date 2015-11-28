import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['query', 'pageToken'],
  query: null,
  pageToken: null,
});
