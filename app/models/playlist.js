import DS from 'ember-data';

export default DS.Model.extend({
  player: DS.belongsTo('player', { async: true }),
  videos: DS.hasMany('video', { async: true })
});
