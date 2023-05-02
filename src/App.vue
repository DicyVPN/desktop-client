<template>
    <RouterView/>
</template>

<script>
import {useCurrentServerStore} from "@/stores/currentServer";
import {RouterView} from 'vue-router'

export default {
    components: {RouterView},
    setup() {
        const currentServer = useCurrentServerStore();
        return {
            currentServer
        }
    },
    beforeMount() {
        setInterval(() => {
            this.currentServer.$patch({
                connected: window.api.isRunning()
            })
        }, 1000)
    }
}
</script>