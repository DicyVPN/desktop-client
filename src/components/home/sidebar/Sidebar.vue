<template>
  <div class="bg-gray-600 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg">
    <div>
      <SettingsCard :toggle="toggle"/>
      <Transition name="expand">
        <DropdownSettings v-if="isOpen" :toggle="toggle"/>
      </Transition>
    </div>
    <StatusCard/>
    <ServerListCard :list="serverList"/>
  </div>
</template>

<script setup>
import SettingsCard from "@/components/home/sidebar/settings/SettingsCard.vue";
import StatusCard from "@/components/home/sidebar/StatusCard.vue";
import DropdownSettings from "@/components/home/sidebar/settings/DropdownSettings.vue";
import ServerListCard from "@/components/home/sidebar/serverList/ServerListCard.vue";
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

