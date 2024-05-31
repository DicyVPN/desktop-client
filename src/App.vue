<template>
    <RouterView v-slot="{ Component }">
        <KeepAlive include="HomeView">
            <Component :is="Component" :key="$route.fullPath"/>
        </KeepAlive>
    </RouterView>

    <Transition name="message-animation">
        <Message :type="message.type" :text="message.text" v-if="message.show"/>
    </Transition>
    <Modal :show="showMissingSubscription " title="Non hai un abbonamento attivo" secondary-label="Chiudi" @secondary="showMissingSubscription = false">
        Visita <a class="underline text-blue-600 hover:text-blue-700 cursor-pointer outline-none" href="https://dicyvpn.com/prices" target="_blank">dicyvpn.com/prices</a> per poter utilizzare tutti i server di DicyVPN
    </Modal>
    <Modal :show="showSecondaryServersAgreement" class="max-w-md" title="Utilizzo dei server secondari"
           action-label="Non mostrare più" @action="saveSecondaryServersPreference(); showSecondaryServersAgreement = false"
           secondary-label="Chiudi" @secondary="showSecondaryServersAgreement = false">
        L'utilizzo dei server secondari consentono la navigazione web di base, ma non sono adatti per i giochi online, i server primari sono consigliati per un'esperienza ottimale.
    </Modal>
    <Modal :show="showServerConnectionTimeout" title="Connessione al server scaduta" secondary-label="Chiudi" @secondary="showServerConnectionTimeout = false">
        La connessione al server è scaduta, prova a riconnetterti o riprova con un altro server.
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
import {INVALID_REFRESH_TOKEN} from '../common/channels';


export default {
    components: {Modal, Message, RouterView},
    data() {
        return {
            message,
            showMissingSubscription,
            showSecondaryServersAgreement,
            showServerConnectionTimeout: false
        };
    },
    setup() {
        const oldTokenObject = JSON.parse(localStorage.getItem('token') || '{}');
        if (oldTokenObject.token) {
            window.settings.set('auth', oldTokenObject);
            localStorage.removeItem('token');
            console.log('Migrated token from localStorage to settings');
        }

        const currentServer = useCurrentServerStore();
        const settings = useSettingsStore();
        return {
            currentServer,
            settings
        };
    },
    async beforeMount() {
        window.preload.on('status-change', this.onStatusChange);
        window.preload.on(INVALID_REFRESH_TOKEN, () => {
            console.debug(INVALID_REFRESH_TOKEN, 'event received');
            this.$router.push('/');
        });
        window.preload.on('server-connection-timeout', () => {
            this.showServerConnectionTimeout = true;
        });

        this.currentServer.$patch({
            status: await window.preload.isRunning() ? Status.CONNECTED : Status.NOT_RUNNING
        });
    },
    beforeUnmount() {
        window.preload.removeListener('status-change', this.onStatusChange);
    },
    methods: {
        onStatusChange(event: Electron.IpcRendererEvent, status: Status) {
            this.currentServer.$patch({
                status
            });
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
