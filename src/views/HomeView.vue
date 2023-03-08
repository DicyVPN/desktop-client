<script setup lang="ts">
import Logo from "@/components/icons/Logo.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import MapCard from "@/components/home/MapCard.vue";
import InformationCard from "@/components/home/InformationCard.vue";

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="flex flex-1 min-h-screen">
    <Sidebar/>
    <div class="flex flex-col">
      <div class="p-8">
        <div class="bg-gray-600 rounded p-8">
          <Logo/>
        </div>
      </div>
      <MapCard class="flex-1"/>
      <InformationCard/>
    </div>
  </div>
</template>

