<template>
    <div class="flex flex-col gap-y-[2px]">
        <Server v-for="server in freeServers" :server="server" />
    </div>
</template>
<script>
import Server from '@/components/home/sidebar/serverList/Server.vue';

export default {
    components: {Server},
    props: {
        serversByCountry: {
            type: Object,
            required: true
        }
    },
    computed: {
        freeServers() {
            const freeServers = [];
            for (const country in this.serversByCountry) {
                for (const server of this.serversByCountry[country]) {
                    if (server.free) {
                        freeServers.push(server);
                    }
                }
            }
            return freeServers.sort((a, b) => a.city.localeCompare(b.city));
        }
    }
};
</script>
