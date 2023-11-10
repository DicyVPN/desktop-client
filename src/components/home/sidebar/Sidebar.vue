<template>
    <div class="bg-gray-600 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg">
        <StatusCard/>
        <ServerListCard :list="list" :reload="reload"/>
    </div>
</template>

<script setup>
import StatusCard from "@/components/home/sidebar/StatusCard.vue";
import ServerListCard from "@/components/home/sidebar/serverList/ServerCardList.vue";
</script>

<script>

export default {
    props: {
        list: {
            type: Object,
            required: true
        },
        reload: {
            type: Function,
            required: true
        }
    }
}
</script>
