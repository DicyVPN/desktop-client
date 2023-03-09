<template>
  <div class="relative">
    <div class="dropdown">
      <div class="flex flex-col gap-12 p-16">
        <DropdownElement icon="gear" text="Impostazioni"/>
        <DropdownElement icon="earth-americas" text="About"/>
        <DropdownElement icon="right-from-bracket" text="Logout"/>
        <DropdownElement icon="rectangle-xmark" text="Chiudi"/>
      </div>
    </div>
  </div>
</template>
<script>
import DropdownElement from "@/components/home/sidebar/settings/DropdownElement.vue";

export default {
  name: 'DropdownSettings',
  components: {DropdownElement},
  props: {
    toggle: {
      type: Function,
      required: true,
    },
  },
  beforeMount() {
    document.addEventListener('click', this.close);
  },
  unmounted() {
    document.removeEventListener('click', this.close);
  },
  methods: {
    close(evt) {
      const parent = this.$el.parentElement;
      if (!(parent === evt.target || parent.contains(evt.target))) {
        this.toggle();
      }
    },
  },

}
</script>
<style scoped>

.dropdown {
  @apply bg-gray-500 rounded absolute inset-x-8 shadow-xl z-20;
  top: calc(-1 * theme('spacing.8'));
}
</style>