<template>
  <div class="flex justify-center items-center min-h-screen">
    <font-awesome-icon icon="fa-solid fa-circle-notch" class="icon-animation h-64 w-64"/>
  </div>
</template>

<script>
export default {
  name: "PlaceholderView",
  mounted() {
    if (localStorage.getItem("token") !== null) {
      this.$router.push({name: "home"});
    }else{
      this.$router.push({name: "login"});
    }
  }

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