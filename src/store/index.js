import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import game from './game';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    game
  }
});
