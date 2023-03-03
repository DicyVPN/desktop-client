<template>
  <div class="sidebar-card h-64 p-16 flex items-center">
    <div class="flex gap-x-16 items-center">
      <UserIcon/>
      <p class="font-medium flex">Mariangelo</p>
    </div>
    <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" class="ml-auto icon"/>
  </div>
</template>
<script>
import UserIcon from "@/components/UserIcon.vue";
import FaChevronDown from "@/components/FaChevronDown.vue";

export default {
  name: 'AccountSelector',
  components: {FaChevronDown, UserIcon}
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