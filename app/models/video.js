import DS from 'ember-data';

export default DS.Model.extend({
  videoId: DS.attr('string'),
  title: DS.attr('string'),
  image: DS.attr('string'),

  // For pagination we will want to keep an `order` attribute which will
  // ultimately make `nextVideo` reference uncessary.
  nextVideo: DS.belongsTo('video', { async: true , inverse: null })
});
