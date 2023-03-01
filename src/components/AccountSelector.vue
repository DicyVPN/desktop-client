<template>
  <div>
    <select class="sidebar-card h-64 p-8">
      <option>Home</option>
    </select>
  </div>
</template>
<script>
//TODO - Change select whit a custom mechanism to select an account
export default {
  name: 'AccountSelector'
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