<template>
  <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen">
    <Sidebar/>
    <div class="flex flex-col flex-1">
      <div class="p-8">
        <div class="bg-gray-600 rounded p-8">
          <Logo/>
        </div>
      </div>
      <div class="flex-1 overflow-hidden">
        <WorldMap class="bg-gray-800 overflow-hidden" data-zoom-on-wheel="zoom-amount: 0.006; min-scale: 1; max-scale: 4;"
                  data-pan-on-drag/>
      </div>
      <InformationCard/>
    </div>
  </div>
</template>

<script>
import 'svg-pan-zoom-container';
import Logo from "@/components/icons/Logo.vue";
import Sidebar from "@/components/home/sidebar/Sidebar.vue";
import InformationCard from "@/components/home/InformationCard.vue";
import WorldMap from "@/components/home/map/WorldMap.vue";

export default {
  name: "HomeView",
  components: {WorldMap, Logo, InformationCard, Sidebar}
};
</script>

