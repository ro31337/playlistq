import DS from 'ember-data';

export default DS.Model.extend({
  videoId: DS.attr('string'),
  title: DS.attr('string'),
  image: DS.attr('string'),
  playlist: DS.belongsTo('playlist', { async: true })
});
