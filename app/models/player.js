import DS from 'ember-data';

export default DS.Model.extend({
  videoId: DS.attr('string'),
  state: DS.attr('string'),
  time: DS.attr('number'),
  timeUpdatedAt: DS.attr('number'),
  playlist: DS.belongsTo('playlist')
});
