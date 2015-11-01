import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['query'],
  query: '',
  queryField: '',

  actions: {
    search() {
      this.set('query', this.get('queryField'));
    }
  }
});
