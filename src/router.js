import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Login from './views/Login';
import Join from './views/Join';
import Create from './views/Create';
import Lobby from './views/Lobby';
import Game from './views/Game';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    },
    {
      path: '/lobby/:gameId',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/lobby',
      name: 'Create',
      component: Create
    },
    {
      path: '/game/:gameId',
      name: 'Game',
      component: Game
    }
  ]
});
