<template>
  <div class="bg-gray-600 w-256 h-screen p-8 flex flex-col gap-8">
    <AccountSelector/>
    <Status/>
    <div class="sidebar-card h-full p-8 flex flex-col gap-8 w-full overflow-y-auto">
      <p class="ml-8 mt-8 text-small font-light">Server Consigliati</p>
      <div class="flex flex-col gap-y-[2px]">
        <Server country="de" city="Düssendorf"/>
        <Server country="de" city="Frankfurt"/>
      </div>
      <div>
        <p class="ml-8 text-small font-light">Altri Server</p>
        <div class="mt-8 bg-gray-600 w-full h-[1px]"></div>
      </div>
      <Dropdown/>
    </div>
  </div>
</template>


<script setup lang="ts">
import AccountSelector from "@/components/AccountSelector.vue";
import Status from "@/components/Status.vue";
import Server from "@/components/Server.vue";
import Dropdown from "@/components/Dropdown.vue";
</script>

<style scoped>
.sidebar-card::-webkit-scrollbar {
  width: 8px;
}

.sidebar-card::-webkit-scrollbar-track {
  border-bottom-right-radius: theme('borderRadius.DEFAULT');
  border-top-right-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card::-webkit-scrollbar-thumb {
  background: theme('colors.gray.900');
  border-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card::-webkit-scrollbar-thumb:hover {
  background: black;
}
</style>