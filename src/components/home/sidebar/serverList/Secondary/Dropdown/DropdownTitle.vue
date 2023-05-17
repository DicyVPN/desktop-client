<template>
  <div class="flex gap-8 m-8">
    <div class="flex w-full items-center gap-8">
      <Flag :country="country" :small="true"/>
      <p class="text-small">{{ name }}</p>
      <font-awesome-icon icon="fa-solid fa-chevron-down" class="ml-auto icon text-small" :rotation="rotate"/>
    </div>
  </div>
</template>
<script>
import FaChevronDown from "@/components/icons/FaChevronDown.vue";
import Flag from "@/components/icons/Flag.vue";
import countries from "i18n-iso-countries";

import i18n_iso_countries from "i18n-iso-countries/langs/it.json";

i18n_iso_countries.countries.US = "Stati Uniti";

export default {
  components: {Flag, FaChevronDown},
  props: {
    country: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    //Rotate chevron if dropdown is open
    rotate() {
      return this.isOpen ? 180 : null
    },
    //Get country name from country code in italian
    name() {
      countries.registerLocale(i18n_iso_countries);
      return countries.getName(this.country, 'it')
    }
  }
}
</script>