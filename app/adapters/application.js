import config from '../config/environment';
import Ember from 'ember';
import Firebase from 'firebase';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  firebase: new Firebase(config.firebase)
});
