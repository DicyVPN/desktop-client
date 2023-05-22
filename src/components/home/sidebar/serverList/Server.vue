<template>
    <div class="card" @click="connect()">
        <p class="server-city-name">{{ server.city }}</p>
        <div class="flex justify-end gap-8">
            <p class="location-text text-tiny">{{ server.name }}</p>
            <Flag :small="true" :country="server.country"/>
        </div>
    </div>
</template>
<script>
import Flag from "@/components/icons/Flag.vue";
import {useCurrentServerStore} from "@/stores/currentServer";
import {throwError} from "@/global";

export default {
    components: {Flag},
    props: {
        server: {
            type: Object,
            required: true
        },
    },
    methods: {
        connect() {
            try {
                window.api.startVPN(this.server.id, this.server.type).then(() => {
                    this.currentServer.$patch({
                            connected: true,
                            id: this.server.id,
                            type: this.server.type,
                            country: this.server.country,
                            city: this.server.city,
                        },
                    )
                })
            } catch (e) {
                throwError("Errore di connessione al server, riprova")
            }
        }
    },
    setup() {
        const currentServer = useCurrentServerStore();
        return {
            currentServer
        }
    }
}
</script>

<style scoped>
.card {
    @apply bg-gray-900 flex w-full p-8 rounded items-center hover:bg-gray-700;
}

.server-city-name {
    @apply text-small text-ellipsis overflow-hidden flex-1;
    line-clamp: 1;
    overflow: hidden;
    white-space: nowrap;
}
</style>