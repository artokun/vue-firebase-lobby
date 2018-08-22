<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span v-if="roomDetails">{{' | '}}</span>
      <router-link v-if="roomDetails" :to="{ name: 'Lobby', params: { gameId: roomDetails.roomId }}">Lobby</router-link>
      <span v-if="userName">{{' | '}}</span>
      <router-link v-if="userName" to="/login">Logout</router-link>
    </div>
    <router-view/>
    <div v-if="userName" class="user-card">
      <img :src="photoURL" />
      <span>{{userName}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  beforeCreate() {
    this.$store.dispatch('auth/watchAuthState');
  },
  computed: {
    ...mapGetters('auth', ['userName', 'photoURL']),
    ...mapGetters('game', ['roomDetails'])
  },
  watch: {
    roomDetails(val) {
      if (val) {
        this.$router.push({ name: 'Lobby', params: { gameId: val.roomId } })
      }
    }
  }
};
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  justify-content: center;
  padding: 50px;
  box-sizing: border-box;
}
.user-card {
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 5px;
  right: 5px;

  img {
    border-radius: 50%;
    border: 1px solid gray;
    height: 25px;
    width: 25px;
  }

  span {
    margin-left: 10px;
  }
}
</style>
