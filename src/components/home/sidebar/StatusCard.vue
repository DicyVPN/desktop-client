<template>
    <div>
        <div class="sidebar-card p-16 rounded grid gap-16">
            <div class="flex items-center gap-8">
                <div class="flex relative">
                    <span v-if="isLoading" class="animate-ping absolute h-full w-full rounded-full opacity-75" :class="{'bg-red-200': currentServer.status !== Status.CONNECTED, 'bg-green-100': currentServer.status === Status.CONNECTED}"></span>
                    <font-awesome-icon v-if="currentServer.status === Status.CONNECTED" icon="fa-solid fa-check-circle" class="text-bright-green"/>
                    <font-awesome-icon v-else icon="fa-solid fa-circle-xmark" class="text-red-300"/>
                </div>
                <p class="text-small font-light">{{ currentServer.status === Status.CONNECTED ? 'Connesso' : 'Disconnesso' }}</p>
                <router-link to="/settings" class="flex items-center w-full hover:text-gray-200 outline-none">
                    <font-awesome-icon icon="fa-solid fa-gear" class="ml-auto"/>
                </router-link>

            </div>

            <div class="w-full h-[1px]"
                 :class="{'bg-bright-green' : currentServer.status === Status.CONNECTED, 'bg-red-300' : currentServer.status !== Status.CONNECTED}"></div>
            <div class="flex w-full" v-if="currentServer.id">
                <p>{{ currentServer.city }}</p>
                <div class="flex ml-auto">
                    <div class="flex gap-8">
                        <p class="location-text">{{ currentServer.name }}</p>
                        <Flag :small="false" :country="currentServer.country"/>
                    </div>
                </div>
            </div>

            <Button v-if="currentServer.id || currentServer.status === Status.CONNECTED"
                    :color="currentServer.status === Status.CONNECTED || currentServer.status === Status.DISCONNECTING ? 'red' : 'green'"
                    @click="connectToLastServer" :disabled="isLoading">
                <div> {{ connectButtonLabel }}</div>
            </Button>
            <div v-else class="text-small text-gray-200 text-center">
                Scegli un server tra quelli disponibili nella lista
            </div>
        </div>
    </div>
</template>
<script>
import CheckCircle from "@/components/icons/CheckCircle.vue";
import Flag from "@/components/icons/Flag.vue";
import Button from "@/components/icons/Button.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useCurrentServerStore} from "@/stores/currentServer";
import {useInformationStore} from "@/stores/information";
import {refreshIp} from "@/utils/api";
import {showMissingSubscription, throwError} from '@/global';
import {Status} from '../../../../electron/main/vpn/status';

export default {
    name: 'Status',
    components: {
        FontAwesomeIcon,
        CheckCircle,
        Flag,
        Button
    },
    setup() {
        const currentServer = useCurrentServerStore();
        const information = useInformationStore();
        return {
            currentServer,
            information,
            Status
        }
    },
    methods: {
        async connectToLastServer() {
            if (this.currentServer.status === Status.CONNECTING) {
                return;
            }

            if (this.currentServer.status === Status.CONNECTED) {
                window.api.stopVPN().then(() => {
                    setTimeout(() => this.refreshIp(), 2000);
                });
            } else {
                try {
                    await window.api.startVPN(this.currentServer.id, this.currentServer.type);
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
        },
        refreshIp() {
            refreshIp().then((ip) => {
                this.information.$patch({
                    ip: ip
                })
            })
        }
    },
    computed: {
        isLoading() {
            return this.currentServer.status === Status.CONNECTING || this.currentServer.status === Status.DISCONNECTING;
        },
        connectButtonLabel() {
            switch (this.currentServer.status) {
                case Status.CONNECTED:
                    return 'Disconnetti';
                case Status.CONNECTING:
                    return 'Connessione in corso...';
                case Status.DISCONNECTING:
                    return 'Disconnessione...';
                default:
                    return 'Connetti';
            }
        }
    }
}
</script>

<style scoped>
.location-text {
    font-size: 0.9375rem; /* 15px */
}
</style>
