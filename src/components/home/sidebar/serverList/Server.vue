<template>
  <div class="bg-gray-900 flex w-full p-8 rounded items-center" @click="connect(tag)">
    <p class="city text-small text-ellipsis overflow-hidden flex-1">{{ city }}</p>
    <div class="flex justify-end gap-8">
      <p class="location-text text-tiny">{{tag}}</p>
      <Flag :small="true" :country="country"/>
    </div>
  </div>
</template>
<script>
import Flag from "@/components/icons/Flag.vue";

export default {
  components: {Flag},
  props: {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    tag() {
      return this.country.toUpperCase() + "_0" + this.id
    }
  },
  methods: {
    connect(confTag) {
      window.api.startVPN(confTag)
    }
  },
}
</script>

<style scoped>
.city {
  line-clamp: 1;
  overflow: hidden;
  white-space: nowrap;
}
</style>