import { auth, firestore } from 'firebase/app';

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    userName({ user }) {
      return user ? user.displayName : null;
    },
    photoURL({ user }) {
      return user ? user.photoURL : null;
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    UNSET_USER(state) {
      state.user = false;
    }
  },
  actions: {
    watchAuthState({ commit, dispatch, state }) {
      auth().onAuthStateChanged(async user => {
        if (user) {
          return dispatch('getPlayerData', user.uid);
        } else if (state.user !== null) {
          return commit('UNSET_USER');
        }
      });
    },
    async loginWithFacebook() {
      console.log('signing in with facebook');
      const provider = new auth.FacebookAuthProvider();
      await auth().signInWithPopup(provider);
    },
    async loginWithGoogle() {
      console.log('signing in with google');
      const provider = new auth.GoogleAuthProvider();
      await auth().signInWithPopup(provider);
    },
    async getPlayerData({ commit, dispatch }, uid) {
      const playerDoc = await firestore()
        .collection('users')
        .doc(uid)
        .get();
      if (playerDoc.exists) {
        const player = playerDoc.data();

        if (player.roomId) {
          dispatch('game/joinRoom', player.roomId, { root: true });
        }
        return commit('SET_USER', { ...player, id: uid });
      } else {
        console.debug('Player Data not avaiable, retrying...');
        setTimeout(() => dispatch('getPlayerData', uid), 1000);
      }
    },
    async updatePlayer({ state, commit }, update) {
      await firestore()
        .collection('users')
        .doc(state.user.id)
        .update(update);
      commit('SET_USER', { ...state.user, ...update });
    },
    async logout({ dispatch }) {
      await dispatch('game/leaveRoom', null, { root: true });
      await auth().signOut();
    }
  }
};
