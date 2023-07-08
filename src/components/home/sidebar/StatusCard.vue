<template>
    <div>
        <div class="sidebar-card p-16 rounded grid gap-16">
            <div class="flex items-center gap-8">
                <div class="flex relative">
                    <span v-if="isConnecting" class="animate-ping absolute h-full w-full rounded-full opacity-75" :class="{'bg-red-200': !currentServer.connected, 'bg-green-100': currentServer.connected}"></span>
                    <font-awesome-icon v-if="currentServer.connected" icon="fa-solid fa-check-circle" class="text-bright-green"/>
                    <font-awesome-icon v-else icon="fa-solid fa-circle-xmark" class="text-red-300"/>
                </div>
                <p class="text-small font-light">{{ currentServer.connected ? 'Connesso' : 'Disconnesso' }}</p>
                <router-link to="/settings/general" class="flex items-center w-full hover:text-gray-200 outline-none">
                    <font-awesome-icon icon="fa-solid fa-gear" class="ml-auto"/>
                </router-link>

            </div>

            <div class="w-full h-[1px]"
                 :class="{'bg-bright-green' : currentServer.connected, 'bg-red-300' : !currentServer.connected}"></div>
            <div class="flex w-full" v-if="currentServer.id">
                <p>{{ currentServer.city }}</p>
                <div class="flex w-full justify-end">
                    <div class="flex gap-8">
                        <p class="location-text">{{ currentServer.name }}</p>
                        <Flag :small="false" :country="currentServer.country"/>
                    </div>
                </div>
            </div>

            <Button v-if="currentServer.id || currentServer.connected" :color=" currentServer.connected ? 'red' : 'green'" @click="connectToLastServer" :disabled="isConnecting">
                <div> {{ currentServer.connected ? 'Disconnetti' : 'Connetti' }}</div>
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
import {refreshIp} from "@/assets/api";
import {throwError} from "@/global";

export default {
    name: 'Status',
    components: {
        FontAwesomeIcon,
        CheckCircle,
        Flag,
        Button
    },
    data() {
        return {
            isConnecting: false
        }
    },
    setup() {
        const currentServer = useCurrentServerStore();
        const information = useInformationStore();
        return {
            currentServer,
            information
        }
    },
    methods: {
        async connectToLastServer() {
            if (this.isConnecting) {
                return;
            }

            this.isConnecting = true;
            if (this.currentServer.connected) {
                window.api.stopVPN().then(() => {
                    this.currentServer.$patch({
                        connected: false,
                    })
                    setTimeout(() => this.refreshIp(), 2000)
                })
            } else {
                try {
                    await window.api.startVPN(this.currentServer.id, this.currentServer.type)
                } catch (e) {
                    console.debug(e)
                    throwError("Errore durante la connessione al server")
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
    watch: {
        'currentServer.connected'() {
            this.isConnecting = false;
        }
    }
}
</script>

<style scoped>
.location-text {
    font-size: 0.9375rem; /* 15px */
}
</style>
