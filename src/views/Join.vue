<template>
  <div class="container">
    <input type="text" v-model="roomCode" placeholder="Enter Code">
    <Button @click="joinRoomByShortCode(roomCodeFormatted)">Join</Button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Button from '@/components/Button';

export default {
  data() {
    return {
      roomCode: ''
    }
  },
  computed: {
    roomCodeFormatted() {
      return this.roomCode.toUpperCase()
    }
  },
  components: { Button },
  methods: {
    ...mapActions('game', ['joinRoomByShortCode'])
  }
}
</script>

<style lang="scss" scoped>
input {
  border: 1px solid gray;
  font-size: 25px;
  text-align: center;
  margin-bottom: 15px;
}
</style>
