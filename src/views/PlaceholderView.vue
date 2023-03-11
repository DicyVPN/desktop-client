<template>
  <div class="flex justify-center items-center min-h-screen" @click="change">
    <font-awesome-icon icon="fa-solid fa-circle-notch" class="icon-animation h-64 w-64"/>
    <router-link to="/home">Home</router-link>
    <router-link to="/login">Loading</router-link>
  </div>
</template>

<script>
export default {
  name: "PlaceholderView",
  methods: {
    change() {
      //change view
      this.$router.push({name: "LoginView"});
    },
  },

}
</script>

<style scoped>
.icon-animation {
  animation: ruota 2s infinite linear;
}

@keyframes ruota {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>