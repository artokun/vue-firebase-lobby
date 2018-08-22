<template>
  <div class="container">
    <h1 v-if="roomDetails">{{roomDetails.roomId}}</h1>
    <ul v-if="roomDetails">
      <li v-for="player in roomDetails.players" :key="player.id">
        <img :src="player.photoURL" alt="avatar">
        <div>
          <span>{{ player.displayName }}</span><br />
          <small>{{ fromNow(player.lastHeartbeat)}}</small>
        </div>
      </li>
    </ul>
    <section>
      <article>
        <span>Chat Goes Here...</span>
      </article>
      <form>
        <input type="text">
        <button>Send</button>
      </form>
    </section>
    <Button v-if="roomDetails" @click="leave()">Leave Room</Button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Button from '@/components/Button';
import moment from 'moment';

export default {
  components: { Button },
  computed: {
    ...mapGetters('game', ['roomDetails'])
  },
  methods: {
    ...mapActions('game', ['leaveRoom']),
    fromNow(unix) {
      return moment(unix).fromNow()
    },
    leave() {
      this.leaveRoom();
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  display: flex;
  align-items: center;
}
img {
  height: 40px;
  width: 40px;
  margin-right: 10px;
}
section {
  flex: 1;
}
</style>
