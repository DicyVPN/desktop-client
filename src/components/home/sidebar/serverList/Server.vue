<template>
    <div class="card cursor-pointer" @click="connect()">
        <p class="server-city-name">{{ server.city }}</p>
        <div class="flex justify-end gap-8 items-center">
            <LoadIndicator :load="server.load"/>
            <p class="location-text text-tiny">{{ server.name }}</p>
            <Flag :small="true" :country="server.country"/>
        </div>
    </div>
</template>
<script>
import {useCurrentServerStore} from '@/stores/currentServer';
import {useSettingsStore} from '@/stores/settings';
import Flag from '@/components/icons/Flag.vue';
import {showMissingSubscription, showSecondaryServersAgreement, throwError} from '@/global';
import LoadIndicator from '@/components/home/sidebar/serverList/LoadIndicator.vue';
import {Status} from '../../../../../electron/main/vpn/status';

export default {
    components: {LoadIndicator, Flag},
    props: {
        server: {
            type: Object,
            required: true
        }
    },
    setup() {
        const currentServer = useCurrentServerStore();
        const settings = useSettingsStore();

        return {
            currentServer,
            settings
        };
    },
    methods: {
        async connect() {
            if (this.server.type === 'secondary' && !this.settings.options.agreedToUseSecondaryServers) {
                showSecondaryServersAgreement.value = true;
                return;
            }

            try {
                await window.preload.startVPN(this.server.id, this.server.type).then(() => {
                    this.currentServer.$patch({
                            id: this.server.id,
                            type: this.server.type,
                            protocol: this.server.type === 'primary' ? 'wireguard' : 'openvpn',
                            country: this.server.country,
                            city: this.server.city,
                            name: this.server.name
                        }
                    );
                });
            } catch (e) {
                if (e.message === 'NO_SUBSCRIPTION') {
                    showMissingSubscription.value = true;
                } else {
                    console.error(e);
                    throwError('Errore di connessione al server, riprova');
                }
                this.currentServer.$patch({
                    status: Status.NOT_RUNNING
                });
            }
        }
    }
};
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
