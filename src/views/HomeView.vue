<template>
    <div v-if="loadingStatus" class="flex inset-0 z-50 h-screen w-screen bg-gray-900 opacity-90 absolute justify-center items-center">
        <font-awesome-icon icon="fa-solid fa-circle-notch" class="icon-animation h-64 w-64"/>
    </div>


    <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen select-none">
        <Sidebar class="w-256" :list="serverList"/>
        <div class="include-sidebar flex flex-col flex-1">
            <div class="p-8">
                <div class="bg-gray-600 rounded p-8 shadow-4">
                    <Logo/>
                </div>
            </div>
            <div class="flex-1 overflow-hidden">
                <div class="zoom-container">
                    <font-awesome-icon icon="fa-solid fa-minus" class="icon zoom rounded-bl"
                                       @click="zoomController(false)"/>
                    <font-awesome-icon icon="fa-solid fa-plus" class="icon zoom" @click="zoomController(true)"/>
                </div>
                <WorldMap class="bg-gray-800 shadow-4 overflow-hidden" :map-scale="zoom"/>
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
import {apiGet} from "@/utils/api";

const scaleModifier = 0.5;
export default {
    name: "HomeView",
    components: {WorldMap, Logo, InformationCard, Sidebar},
    data() {
        return {
            zoom: 1,
            serverList: {
                primary: [],
                secondary: []
            },
            loadingStatus: true,

        };
    },
    async mounted() {
        this.serverList = await apiGet("/v1/servers/list").then(res => res.json());

        this.loadingStatus = false;
    },

    methods: {
        zoomController(type) {
            if (type) {
                (this.zoom + scaleModifier > 3) ? this.zoom = 3 : this.zoom += scaleModifier;
            } else {
                (this.zoom - scaleModifier < 1) ? this.zoom = 1 : this.zoom -= scaleModifier
            }
        },
    }
};
</script>

<style>
.zoom-container {
    right: 0;
    @apply absolute z-20 flex px-8 bg-gray-900/95 rounded-bl shadow-4;
}

.zoom {
    height: 1.125rem; /* 18px */
    cursor: pointer;
}

.zoom:hover {
    @apply bg-gray-700;
}

.zoom:first-child {
    @apply p-8;
}

.zoom:last-child {
    @apply p-8;
}
</style>
