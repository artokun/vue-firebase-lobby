const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mobile-mayhem-e6d73.firebaseio.com'
});

exports.createUser = functions.auth.user().onCreate(event => {
  const user = event.data;
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      gamesPlayed: 0,
      gamesWon: 0,
      globalScore: 0,
      roomId: null,
      createdAt: event.timestamp
    })
    .then(() => console.log('successfully created user'))
    .catch(e => console.error(e));
});

exports.deleteUser = functions.auth.user().onDelete(event => {
  const user = event.data;
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .delete()
    .then(() => console.log('successfully deleted user'))
    .catch(e => console.error(e));
});
