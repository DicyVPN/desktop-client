<template>
  <DropdownCountry country="ar" @click="open('ar')"/>
  <Transition name="expand">
    <div v-if="selectedCountry === 'ar'" class="flex flex-col gap-y-[2px]">
      <Server city="Buonasires" country="ar"/>
      <Server city="San Rafael" country="ar"/>
      <Server city="Rafael Castillo" country="ar"/>
      <Server city="Rafael Castilfhidhfuidsfibsdifbsdifbisdfibsdi sdbfsb dfilo" country="ar"/>
    </div>
  </Transition>

  <DropdownCountry country="it"/>
  <DropdownCountry country="gb"/>
  <DropdownCountry country="us"/>
  <DropdownCountry country="ru"/>
  <DropdownCountry country="tz"/>
  <DropdownCountry country="tk"/>
  <DropdownCountry country="pk"/>
  <DropdownCountry country="uz"/>
  <DropdownCountry country="ag"/>
  <DropdownCountry country="mx"/>
  <DropdownCountry country="il"/>
  <DropdownCountry country="lu"/>
  <DropdownCountry country="rs"/>
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
.expand-leave-to
{
  opacity: 0;
  height: 0;
}

</style>