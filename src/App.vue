<template>
    <RouterView v-slot="{ Component }">
        <KeepAlive include="HomeView">
            <Component :is="Component" :key="$route.fullPath"/>
        </KeepAlive>
    </RouterView>

    <Transition name="message-animation">
        <Message :type="message.type" :text="message.text" v-if="message.show"/>
    </Transition>
    <Modal :show="showMissingSubscription" title="Non hai un abbonamento attivo" secondary-label="Chiudi" @secondary="showMissingSubscription = false">
        Visita <span class="underline text-blue-600 hover:text-blue-700 cursor-pointer" @click="openPricesLink">dicyvpn.com/prices</span> per poter utilizzare DicyVPN
    </Modal>
    <Modal :show="showSecondaryServersAgreement" class="max-w-md" title="Utilizzo dei server secondari"
           action-label="Non mostrare più" @action="saveSecondaryServersPreference(); showSecondaryServersAgreement = false"
           secondary-label="Chiudi" @secondary="showSecondaryServersAgreement = false">
        L'utilizzo dei server secondari consentono la navigazione web di base, ma non sono adatti per i giochi online, i server primari sono consigliati per un'esperienza ottimale.
    </Modal>
</template>

<script lang="ts">
import {useCurrentServerStore} from '@/stores/currentServer';
import {useSettingsStore} from '@/stores/settings';
import {RouterView} from 'vue-router';
import Message from '@/components/Message.vue';
import {message, showMissingSubscription, showSecondaryServersAgreement} from '@/global';
import {Status} from '../electron/main/vpn/status';
import Modal from '@/components/Modal.vue';


export default {
    components: {Modal, Message, RouterView},
    data() {
        return {
            message,
            showMissingSubscription,
            showSecondaryServersAgreement
        };
    },
    setup() {
        const currentServer = useCurrentServerStore();
        const settings = useSettingsStore();
        return {
            currentServer,
            settings
        };
    },
    async beforeMount() {
        window.api.on('status-change', this.onStatusChange);

        this.currentServer.$patch({
            status: await window.api.isRunning() ? Status.CONNECTED : Status.NOT_RUNNING
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
        },
        openPricesLink() {
            window.api.externalLink('https://dicyvpn.com/prices');
        },
        saveSecondaryServersPreference() {
            this.settings.$patch({
                options: {
                    agreedToUseSecondaryServers: true
                }
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
