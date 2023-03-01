<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import Sidebar from "@/components/Sidebar.vue";

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar/>

    <div class="flex-1 p-8">
      <div class="bg-gray-600 rounded p-8">
        <Logo />
      </div>
    </div>
  </div>


</template>

