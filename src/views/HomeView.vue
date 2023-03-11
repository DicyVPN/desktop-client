<template>
  <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen select-none">
    <Sidebar class="w-256"/>
    <div class="main flex flex-col flex-1">
      <div class="p-8">
        <div class="bg-gray-600 rounded p-8">
          <Logo/>
        </div>
      </div>
      <div class="flex-1 overflow-hidden">
        <div class="zoom-container">
          <font-awesome-icon icon="fa-solid fa-minus" class="icon zoom rounded-bl" @click="zoomController(false)"/>
          <font-awesome-icon icon="fa-solid fa-plus" class="icon zoom" @click="zoomController(true)"/>
        </div>
        <WorldMap class="bg-gray-800 overflow-hidden" :map-scale="zoom"/>
      </div>
      <InformationCard/>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/icons/Logo.vue";
import Sidebar from "@/components/home/sidebar/Sidebar.vue";
import InformationCard from "@/components/home/InformationCard.vue";
import WorldMap from "@/components/home/map/WorldMap.vue";

const scaleModifier = 0.5;
export default {
  name: "HomeView",
  components: {WorldMap, Logo, InformationCard, Sidebar},
  data() {
    return {
      zoom: 1,

    };
  },
  methods: {
    zoomController(type){
      if(type){
        (this.zoom + scaleModifier > 2) ? this.zoom = 2 : this.zoom += scaleModifier;
      }else{
        (this.zoom - scaleModifier < 0.5) ? this.zoom = 0.5 : this.zoom -= scaleModifier
      }
    }
  }
};
</script>

<style>
.main {
  width: calc(100% - theme('spacing.256'));
}

.zoom-container{
  right: 0;
  @apply absolute flex z-20;
}

.zoom{
  @apply opacity-95 bg-gray-900 p-16;
}

.zoom:hover{
  @apply bg-gray-700;
}
</style>
