<template>
  <div class="btn">
    <button class="btn__static" v-if="!to" v-on="$listeners">
      <slot />
    </button>
    <router-link class="btn__link" v-if="to" :to="to">
      <button class="btn__link--inner" v-on="$listeners">
        <slot />
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: ['to']
};
</script>

<style lang="scss" scoped>
.btn {
  -webkit-appearance: none;
  border: 1px solid black;
  padding: 5px;
  margin-bottom: 20px;

  &__static {
    width: 100%;
  }

  &__link {
    display: inline-block;
    width: 100%;

    &--inner {
      width: 100%;
    }
  }
}
</style>
