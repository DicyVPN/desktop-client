<template>
  <div class="bg-gray-900 flex w-full p-8 rounded items-center" @click="connect(id, type, protocol)">
    <p class="city text-small text-ellipsis overflow-hidden flex-1">{{ city }}</p>
    <div class="flex justify-end gap-8">
      <p class="location-text text-tiny">{{ name }}</p>
      <Flag :small="true" :country="country"/>
    </div>
  </div>
</template>
<script>
import Flag from "@/components/icons/Flag.vue";
import {useCurrentServerStore} from "@/stores/currentServer";

export default {
  components: {Flag},
  props: {
    type: {
      type: String,
      required: true
    },
    protocol: {
      type: String,
      required: true
    },
    id: {
      type: [Number, String],
      required: true
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  methods: {
      connect(id, type, protocol) {
          console.log(id, type, protocol)

          window.api.startVPN(id, type, protocol).then(() => {
              this.currentServer.$patch({
                      connected: true,
                      id: this.id,
                      type: this.type,
                      protocol: this.protocol,
                  },
              )
          })
      }
  },
  setup() {
    const currentServer = useCurrentServerStore();
    return {
      currentServer
    }
  }
}
</script>

<style scoped>
.city {
  line-clamp: 1;
  overflow: hidden;
  white-space: nowrap;
}
</style>