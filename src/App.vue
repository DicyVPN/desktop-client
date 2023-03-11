<template>
  <RouterView/>
</template>

<script>
import {useCurrentServerStore} from "@/stores/currentServer";
import {RouterView} from 'vue-router'

export default {
  components: {RouterView},
  setup() {
    const currentServer = useCurrentServerStore();
    return {
      currentServer
    }
  },
  beforeMount() {
    if (!window.api.isChildAlive()) {
      this.currentServer.$patch({
        connected: false
      })
    }
  }
}
</script>