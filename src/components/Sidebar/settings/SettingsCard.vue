<template>
  <div class="sidebar-card h-64 p-16 flex items-center">
    <div class="flex gap-x-16 items-center">
      <UserIcon/>
      <p class="font-medium flex">Mariangelo</p>
    </div>

    <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" class="ml-auto icon p-4" @click="toggle()"/>
  </div>
</template>
<script>
import UserIcon from "@/components/icons/UserIcon.vue";
import FaChevronDown from "@/components/icons/FaChevronDown.vue";

export default {
  name: 'AccountSelector',
  components: {FaChevronDown, UserIcon},
  props: {
    toggle: {
      type: Function,
      required: true,
    },
  },
}
</script>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>