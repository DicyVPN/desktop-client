<template>
  <div class="bg-gray-600 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg">
    <StatusCard/>
    <ServerListCard :list="serverList"/>
  </div>
</template>

<script setup>
import StatusCard from "@/components/home/sidebar/StatusCard.vue";
import ServerListCard from "@/components/home/sidebar/serverList/ServerCardList.vue";
</script>

<script>
import {apiGet} from "@/assets/api";

export default {
  data() {
    return {
      isOpen: false,
      serverList: {},
    }
  },
  async mounted() {
    //Request list of server to api primary and secondary
    this.serverList = await apiGet("/v1/servers/list").then(res => res.json());
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  }
}
</script>
<style>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s;
  height: 100%;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  height: 0;
}
</style>

