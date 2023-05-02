<template>
  <img :src="flag" :alt="country" class="flag rounded-sm" :class="{small}">
</template>
<script>
export default {
  props: {
    country: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    flag() {
      return `./assets/flags/${this.country.toLowerCase()}.svg`;
    }
  }
}
</script>d
<style scoped>
.flag {
  height: 1.125rem; /* 18px */
  width: 1.5rem; /* 24px */
  object-fit: cover;
}

.flag.small {
  height: 0.9375rem; /* 15px */
  width: 1.25rem; /* 20px */
}
</style>