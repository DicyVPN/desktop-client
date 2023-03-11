<template>
  <div class="flex gap-8 m-8">
    <div class="flex w-full items-center gap-8">
      <Flag :country="country" :small="true"/>
      <p class="text-small">{{name }}</p>
      <font-awesome-icon icon="fa-solid fa-chevron-down" class="ml-auto icon text-small" :rotation="rotate"/>
    </div>
  </div>
</template>
<script>
import FaChevronDown from "@/components/icons/FaChevronDown.vue";
import Flag from "@/components/icons/Flag.vue";

export default {
  components: {Flag, FaChevronDown},
  props: {
    name: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    rotate() {
      return this.isOpen ? 180 : null
    }
  }
}
</script>