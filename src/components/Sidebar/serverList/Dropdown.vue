<template>
  <div v-for="(serverList, country) in list.other">
    <DropdownCountry :country="serverList.tag"  @click="open(serverList.tag)" :is-open="serverList.tag === selectedCountry" :name="country"/>
    <Transition name="expand">
      <div v-if="selectedCountry === serverList.tag" class="flex flex-col gap-y-[2px]">
        <Server v-for="(server, city) in serverList.server" :city="city" :country="serverList.tag" :id="server.id"/>
      </div>
    </Transition>
  </div>
</template>
<script>
import Server from "@/components/Sidebar/serverList/Server.vue";
import DropdownCountry from "@/components/Sidebar/serverList/CountryDropdown.vue";

export default {
  name: 'Dropdown',
  components: {DropdownCountry, Server},
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