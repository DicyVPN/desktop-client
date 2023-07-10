<template>
    <div class="flex flex-col gap-y-[2px]" v-for="serverList in list.primary">
        <Server v-for="server in getServerList(serverList)" :server="server"/>
    </div>
</template>
<script>
import Server from "@/components/home/sidebar/serverList/Server.vue"

export default {
    name: 'PrimaryServers',
    components: {Server},
    props: {
        list: {
            type: Object,
            required: true
        },
    },
    methods: {
        getServerList(serverList) {
            if (serverList) {
                return serverList.sort((a, b) => a.city.localeCompare(b.city))
            }
            return []
        }
    }
}
</script>
