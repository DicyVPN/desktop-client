<template>
  <font-awesome-icon :icon="icon"/>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    icon() {
      return this.show ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    },
  },
  name: 'ShowIcon'
}
</script>
