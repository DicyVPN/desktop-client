<template>
    <RouterView/>

    <Transition name="message-animation">
        <Message :type="message.type" :text="message.text" v-if="message.show"/>
    </Transition>
</template>

<script lang="ts">
import {useCurrentServerStore} from '@/stores/currentServer';
import {RouterView} from 'vue-router';
import Message from '@/components/options/Message.vue';
import {message} from '@/global';
import {Status} from '../electron/main/vpn/status';


export default {
    components: {Message, RouterView},
    data() {
        return {
            message
        };
    },
    setup() {
        const currentServer = useCurrentServerStore();
        return {
            currentServer
        };
    },
    beforeMount() {
        window.api.on('status-change', this.onStatusChange);

        this.currentServer.$patch({
            status: window.api.isRunning() ? Status.CONNECTED : Status.NOT_RUNNING
        });
    },
    beforeUnmount() {
        window.api.removeListener('status-change', this.onStatusChange);
    },
    methods: {
        onStatusChange(event: Electron.IpcRendererEvent, status: Status) {
            this.currentServer.$patch({
                status
            });
        }
    }
};
</script>
<!--suppress CssUnusedSymbol -->
<style>
.message-animation-enter-active,
.message-animation-leave-active {
    transition: all 0.2s;
    bottom: 0;
}

.message-animation-enter-from,
.message-animation-leave-to {
    bottom: -100%;
}
</style>
