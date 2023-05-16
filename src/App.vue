<template>
    <RouterView/>

    <Transition name="animation">
        <Message :type="message.type" :text="message.text" v-if="message.show"/>
    </Transition>
</template>

<script>
import {useCurrentServerStore} from "@/stores/currentServer";
import {RouterView} from 'vue-router'
import Message from "@/components/options/Message.vue";
import {message} from "@/global";

export default {
    components: {Message, RouterView},
    data() {
        return {
            message
        }
    },
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
    },
}
</script>
<style>

.animation-enter-active,
.animation-leave-active {
    transition: all 0.2s;
    bottom: 0;
}

.animation-enter-from,
.animation-leave-to {
    bottom: -100%;
}


</style>