<template>
    <div class="flex-1 flex flex-col gap-8 p-8">
        <div class="option-card font-light text-gray-200">
            Impostazioni generali dell'applicazione
        </div>

        <div class="option-card">
            <label>
                <input class="align-text-bottom mr-8" type="checkbox" v-model="disconnectAndExitOnClose">
                Disconnetti e chiudi l'applicazione quando si chiude la finestra
            </label>
            <br>
            <label>
                <input class="align-text-bottom mr-8 mt-8" type="checkbox" v-model="minimizeOnClose" :disabled="disconnectAndExitOnClose">
                Riduci a icona la finestra invece di chiuderla
            </label>
        </div>
        <div class="option-card">
            <label>
                <input class="align-text-bottom mr-8" type="checkbox" v-model="connectOnStartup">
                Connetti automaticamente all'avvio all'ultimo server utilizzato
            </label>
        </div>

        <div class="option-card">
            <label>
                <input class="align-text-bottom mr-8" type="checkbox" v-model="useCustomDns">
                Server DNS personalizzati
            </label>
            <div class="text-gray-200 mt-8" v-if="useCustomDns && !dns.length">
                <div>Nessun server DNS personalizzato</div>
            </div>
            <div v-if="useCustomDns" class="inner-div flex flex-wrap gap-8 bg-gray-600 font-mono p-8 rounded mt-12">
                <div class="flex">
                    <input class="dns-input" type="text" v-model="dnsInput" placeholder="8.8.8.8" @keyup.enter="addDns"/>
                    <div class="dns-button bg-blue-500">
                        <font-awesome-icon icon="fa-solid fa-plus" @click="addDns"/>
                    </div>
                </div>

                <div class="flex" v-for="(ip, index) in dns">
                    <div class="dns-ip">{{ ip }}</div>
                    <div class="dns-button bg-gray-500" @click="removeDns(index)">
                        <font-awesome-icon icon="fa-solid fa-trash"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import {throwError} from '@/global';

const disconnectAndExitOnClose = ref(window.settings.get('app.disconnectAndExitOnClose', false));
const minimizeOnClose = ref(window.settings.get('app.minimizeOnClose', false));
const connectOnStartup = ref(window.settings.get('app.connectOnStartup', false));
const useCustomDns = ref(window.settings.get('vpn.useCustomDns', false));
const rawDns = window.settings.get<string[]>('vpn.dns', []);
const dns = ref(rawDns); // workaround, because proxied array refs not working with settings

watch(disconnectAndExitOnClose, (value) => {
    window.settings.set('app.disconnectAndExitOnClose', value);
});
watch(minimizeOnClose, (value) => {
    window.settings.set('app.minimizeOnClose', value);
});
watch(connectOnStartup, (value) => {
    window.settings.set('app.connectOnStartup', value);
});
watch(useCustomDns, (value) => {
    window.settings.set('vpn.useCustomDns', value);
});

const dnsInput = ref('');

function addDns() {
    if (dnsInput.value.length > 0 && window.preload.isIp(dnsInput.value)) {
        rawDns.push(dnsInput.value);
        dnsInput.value = '';
        dns.value = [...rawDns];
        window.settings.set('vpn.dns', rawDns);
    } else {
        throwError('L\'indirizzo IP del server DNS non è valido');
    }
}

function removeDns(index: number) {
    rawDns.splice(index, 1);
    dns.value = [...rawDns];
    window.settings.set('vpn.dns', rawDns);
}
</script>

<style scoped>
.dns-input, .dns-ip {
    @apply bg-gray-700 text-gray-100 px-12 py-4 rounded-r-none outline-none;
}

.dns-input::placeholder {
    @apply text-gray-300;
}

.dns-ip {
    @apply rounded-l;
}

.dns-button {
    @apply flex items-center px-12 rounded-r cursor-pointer;
}
</style>
