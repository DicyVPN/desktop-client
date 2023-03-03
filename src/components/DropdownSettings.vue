<template>
  <div class="relative" v-if="isOpen">
    <div class="dropdown">
      <div class="flex flex-col gap-4 p-8">
        <div class="flex items-center w-full">
          <p>Impostazioni</p>
          <font-awesome-icon icon="fa-solid fa-gear" class="ml-auto icon"/>
        </div>
        <div class="bg-gray-600 h-[1px]"></div>
        <div class="flex items-center w-full">
          <p>Esci</p>
          <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="ml-auto icon"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DropdownSettings',
  props: {
    isOpen: {}
  }
}
</script>
<style scoped>

.dropdown {
  @apply bg-gray-400 rounded absolute inset-x-8 shadow-xl z-20;
  top: calc(-1 * theme('spacing.8'));
}
</style>