<template>
  <div v-for="(serverList, country) in list.secondary">
    <CountryDropdown :country="country"  @click="open(country)" :is-open="country === selectedCountry"/>
    <Transition name="expand">
      <div v-if="selectedCountry === country" class="flex flex-col gap-y-[2px]">
        <Server v-for="server in serverList.sort((a, b) => a.city.localeCompare(b.city))" :city="server.city" :country="country" :id="server.id" @click="connect(server.id, server.type)"/>
      </div>
    </Transition>
  </div>
</template>
<script>
import Server from "@/components/home/sidebar/serverList/Server.vue";
import CountryDropdown from "@/components/home/sidebar/serverList/CountryDropdown.vue";

export default {
  name: 'Dropdown',
  components: {CountryDropdown, Server},
  props: {
    list: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      selectedCountry: null,
    }
  },
  methods: {
    open(country) {
      if (country === this.selectedCountry) {
        this.selectedCountry = null
      } else this.selectedCountry = country
    },
    connect(id, type) {
      window.api.startVPN(id, type, 'openvpn')
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