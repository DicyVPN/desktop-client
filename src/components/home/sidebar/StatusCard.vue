<template>
  <div>
    <div class="sidebar-card p-16 rounded grid gap-16">
      <div class="flex items-center gap-8">
        <font-awesome-icon v-if="currentServer.connected" icon="fa-solid fa-check-circle" class="text-bright-green"/>
        <font-awesome-icon v-else icon="fa-solid fa-circle-xmark" class="text-red-300"/>
        <p class="text-small font-light">{{ currentServer.connected ? "Connesso" : "Disconnesso" }}</p>
      </div>

      <div class="w-full h-[1px]" :class="{'bg-bright-green' : currentServer.connected, 'bg-red-300' : !currentServer.connected}"></div>
      <div class="flex w-full">
        <p>{{ currentServer.city }}</p>
        <div class="flex sr w-full justify-end">
          <div class="flex gap-8">
            <p class="location-text">{{ currentServer.serverTag }}</p>
            <Flag :small="false" :country="currentServer.country"/>
          </div>

        </div>
      </div>

      <Button :color=" currentServer.connected ? 'red' : 'green' " @click="currentServer.$patch({connected: !currentServer.connected})">
        <div> {{ currentServer.connected ? "Disconnetti" : "Connetti" }} </div>
      </Button>
    </div>
  </div>
</template>
<script>
import CheckCircle from "@/components/icons/CheckCircle.vue";
import Flag from "@/components/icons/Flag.vue";
import Button from "@/components/icons/Button.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useCurrentServerStore} from "@/stores/currentServer";

export default {
  name: 'Status',
  components: {
    FontAwesomeIcon,
    CheckCircle,
    Flag,
    Button
  },
  data() {
    return {
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
.location-text {
  font-size: 0.9375rem; /* 15px */
}
</style>