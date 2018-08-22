<template>
  <div class="container">
    Please wait, creating game...
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('game', ['roomDetails'])
  },
  created() {
    if (!this.roomDetails) {
      this.$store.dispatch('game/createRoom')
    } 
  },
  watch: {
    roomDetails(val) {
      if (val) {
        this.$router.push({ name: 'Lobby', params: { gameId: roomDetails.roomId }})
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const room = vm.$store.getters['game/roomDetails']
      if (room) {
        vm.$router.push({ name: 'Lobby', params: { gameId: room.roomId }})
      }
    })
  }
}
</script>
