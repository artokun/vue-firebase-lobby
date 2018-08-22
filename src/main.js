import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from 'firebase/app';
import './services/serviceWorker';
import './services/firebaseWorker';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !auth().currentUser) {
    return next('/login');
  }
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
