<template>
  <div class="flex items-center w-full hover:text-gray-200">
    <p>{{ text }}</p>
    <font-awesome-icon :icon="iconName" class="ml-auto"/>
  </div>
</template>
<script>
export default {
  name: 'DropdownElement',
  props: {
    text: {type: String, required: true},
    icon: {type: String, required: true},
  },
  computed: {
    iconName() {
      return `fa-solid fa-${this.icon}`;
    }
  }

}
</script>
