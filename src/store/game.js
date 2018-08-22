import firebase from 'firebase/app';

function makeid(n) {
  var text = '';
  var possible = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

  for (var i = 0; i < n; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default {
  namespaced: true,
  state: {
    roomSubscription: null,
    room: null
  },
  getters: {
    roomDetails: state => state.room
  },
  mutations: {
    SUBSCRIBE_ROOM(state, ref) {
      state.roomSubscription = ref;
    },
    UNSUBSCRIBE_ROOM(state) {
      typeof state.roomSubscription === 'function' && state.roomSubscription();
      state.roomSubscription = null;
      state.room = null;
    },
    UPDATE_ROOM(state, room) {
      state.room = room;
    }
  },
  actions: {
    async createRoom({ dispatch }) {
      const db = firebase.firestore();

      // generate random 5 alpha (no I or O) room code
      const ref = await db.collection('rooms').add({
        players: {},
        roomId: makeid(5)
      });

      // auto join room that was created.
      await dispatch('joinRoom', ref.id);
      dispatch('cleanOrphanedRooms');
    },
    async joinRoom({ dispatch }, roomId) {
      console.log('joined room');

      // clean up any subscriptions
      await dispatch('unsubscribeFromRoom');

      // remove self from all other rooms
      await dispatch('leaveRoom');

      // add self to room's player list
      await dispatch('refreshHeartbeat', roomId);

      // add roomId to self
      await dispatch('auth/updatePlayer', { roomId }, { root: true });

      // subscribe to room updates
      await dispatch('subscribeToRoom', roomId);
    },
    async joinRoomByShortCode({ dispatch }, roomCode) {
      const db = firebase.firestore();

      // query rooms by roomCode
      try {
        // if exists dispatch joinRoom with roomId
        const snaps = await db
          .collection('rooms')
          .where('roomId', '==', roomCode)
          .limit(1)
          .get();

        if (!snaps.empty) {
          snaps.forEach(doc => doc.exists && dispatch('joinRoom', doc.ref.id));
        } else {
          console.log('No room by that code');
        }
      } catch (e) {
        // else throw error stating invalid code
        console.error(e);
      }
    },
    async subscribeToRoom({ commit, dispatch }, roomId) {
      const db = firebase.firestore();
      const roomSubscription = await db
        .collection('rooms')
        .doc(roomId)
        .onSnapshot(doc => {
          dispatch('resolvePlayers', doc.data().players);
          commit('UPDATE_ROOM', { ...doc.data(), id: roomId });
        });
      commit('SUBSCRIBE_ROOM', roomSubscription);
    },
    async unsubscribeFromRoom({ commit, state }) {
      if (state.roomSubscription) {
        commit('UNSUBSCRIBE_ROOM');
      }
    },
    async resolvePlayers({ commit, state }, players) {
      const db = firebase.firestore();

      const playerPromises = await Promise.all(
        Object.keys(players).map(p =>
          db
            .collection('users')
            .doc(p)
            .get()
        )
      );
      const playerList = playerPromises.map(
        p => (p.exists ? { ...p.data(), id: p.id } : null)
      );
      commit('UPDATE_ROOM', { ...state.room, players: playerList });
    },
    async leaveRoom({ dispatch, rootState }) {
      const db = firebase.firestore();
      await dispatch('unsubscribeFromRoom');
      await dispatch('auth/updatePlayer', { roomId: null }, { root: true });

      return db
        .collection('rooms')
        .where(`players.${rootState.auth.user.id}`, '>', 0)
        .get()
        .then(roomSnaps =>
          roomSnaps.forEach(async doc => {
            if (doc.exists) {
              await doc.ref.update(
                `players.${rootState.auth.user.id}`,
                firebase.firestore.FieldValue.delete()
              );
            }
          })
        );
    },
    async cleanOrphanedRooms() {
      const db = firebase.firestore();
      db.collection('rooms')
        .where('players', '==', {})
        .get()
        .then(snaps => {
          snaps.forEach(doc => {
            if (doc.exists) {
              doc.ref.delete();
            }
          });
        });
    },
    refreshHeartbeat({ rootState, state }, roomId) {
      const db = firebase.firestore();
      return db
        .collection('rooms')
        .doc(roomId || state.room.id)
        .update(`players.${rootState.auth.user.id}`, Date.now());
    }
  }
};
