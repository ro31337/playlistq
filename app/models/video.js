import DS from 'ember-data';

export default DS.Model.extend({
  videoId: DS.attr('string'),
  playlist: DS.belongsTo('playlist')
});
