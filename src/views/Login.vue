<template>
  <div class="container login">
    <h3>{{ userName ? 'See you soon...' : 'Welcome'}}</h3>
    <Button v-if="!userName" @click="loginWithFacebook">Login with Facebook</Button>
    <Button v-if="!userName" @click="loginWithGoogle">Login with Google</Button>
    <Button v-if="userName" @click="logout">Logout</Button>
  </div>
</template>

<script>
import Button from '@/components/Button';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { Button },
  computed: {
    ...mapGetters('auth', ['userName'])
  },
  methods: {
    ...mapActions('auth', ['loginWithFacebook', 'loginWithGoogle', 'logout'])
  },
  watch: {
    userName(name) {
      if (name) {
        this.$router.push({ name: 'Home' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
