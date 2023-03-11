<template>
  <div class="sidebar-card h-full w-full relative overflow-hidden">
    <div class="sidebar-card-inner p-8 h-full flex flex-col gap-8 overflow-y-auto">
      <p class="ml-8 mt-8 text-small font-light">Server Consigliati</p>
      <div class="flex flex-col gap-y-[2px]" v-for="country in serverList.suggest">
        <Server v-for="(city, name) in country.server" :country="country.tag" :city="name" :id="city.id" @click="connect"/>
      </div>
      <div>
        <p class="ml-8 text-small font-light">Altri Server</p>
        <div class="mt-8 bg-gray-600 w-full h-[1px]"></div>
      </div>
      <div class="flex flex-col gap-2">
        <Dropdown :list="serverList"/>
      </div>
    </div>
    <div class="bottom-shadow absolute shadow-personal"></div>
  </div>
</template>
<script>
import Dropdown from "@/components/home/sidebar/serverList/Dropdown.vue"
import Server from "@/components/home/sidebar/serverList/Server.vue"
export default {
  name: 'ServerListCard',
  components: {Dropdown, Server},
  props: {
    serverList: {}
  },
  methods: {
    connect() {
      window.api.startVPN()

    }
  }
}
</script>
<style scoped>
.sidebar-card-inner::-webkit-scrollbar {
  width: 8px;
}

.sidebar-card-inner::-webkit-scrollbar-track {
  border-bottom-right-radius: theme('borderRadius.DEFAULT');
  border-top-right-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card-inner::-webkit-scrollbar-thumb {
  background: theme('colors.gray.900');
  border-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card-inner::-webkit-scrollbar-thumb:hover {
  background: black;
}

.bottom-shadow {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: linear-gradient(to top, hsl(222, 10%, 5%), rgb(0 0 0 / 0) 3.6rem, rgb(0 0 0 / 0));
  pointer-events: none;
}
</style>