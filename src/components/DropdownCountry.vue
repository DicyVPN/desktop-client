<template>
  <div class="flex gap-8 m-8">
    <div @click="open()" class="flex w-full items-center gap-8">
      <Flag :country="country" :small="true"/>
      <p class="text-small">Argentina</p>
      <div class="ml-auto">
        <fa-chevron-down/>
      </div>
    </div>
  </div>
</template>
<script>
import FaChevronDown from "@/components/FaChevronDown.vue";
import Flag from "@/components/Flag.vue";

export default {
  components: {Flag, FaChevronDown},
  props: {
    country: {
      type: String,
      required: true
    }
  },
}
</script>