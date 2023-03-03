<template>
  <div class="sidebar-card h-full p-8 flex flex-col gap-8 w-full overflow-y-auto">
    <p class="ml-8 mt-8 text-small font-light">Server Consigliati</p>
    <div class="flex flex-col gap-y-[2px]" v-for="country in serverList.suggest">
      <Server v-for="(city, name) in country.server" :country="country.tag" :city="name" :id="city.id"/>
    </div>
    <div>
      <p class="ml-8 text-small font-light">Altri Server</p>
      <div class="mt-8 bg-gray-600 w-full h-[1px]"></div>
    </div>
    <Dropdown :list="serverList"/>
  </div>
</template>
<script>
import Dropdown from "@/components/Sidebar/serverList/Dropdown.vue"
import Server from "@/components/Sidebar/serverList/Server.vue"

export default {
  name: 'ServerListCard',
  components: {Dropdown, Server},
  props: {
    serverList: {}
  }
}
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