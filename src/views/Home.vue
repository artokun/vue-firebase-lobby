<template>
  <div class=" container home">
    <h3>Mobile Mayhem</h3>
    <Button to="/join">Join</Button>
    <Button to="/lobby">Create</Button>
  </div>
</template>

<script>
import Button from '@/components/Button';

export default {
  name: 'home',
  components: { Button },
};
</script>

<style lang="scss" scoped>
</style>
