<template>
  <DropdownCountry country="ar" @click="open('ar')"/>
  <div v-if="selectedCountry === 'ar'" class="flex flex-col gap-y-[2px]">
    <Server city="Buonasires" country="ar"/>
    <Server city="San Rafael" country="ar"/>
    <Server city="Rafael Castillo" country="ar"/>
    <Server city="Rafael Castilfhidhfuidsfibsdifbsdifbisdfibsdi sdbfsb dfilo" country="ar"/>
  </div>
  <DropdownCountry country="it"/>
  <DropdownCountry country="gb"/>
  <DropdownCountry country="us"/>
</template>
<script>
import Server from "@/components/Server.vue";
import DropdownCountry from "@/components/DropdownCountry.vue";

export default {
  name: 'Dropdown',
  components: {DropdownCountry, Server},
  data() {
    return {
      selectedCountry: null,
    }
  },
  methods: {
    open(country) {
      if (country === this.selectedCountry) {
        this.selectedCountry = null
      }else this.selectedCountry = country
    }
  }
}
</script>