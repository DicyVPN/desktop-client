<template>
    <div class="flex-1 flex flex-col gap-8 p-8">
        <div class="option-card font-light text-gray-200">
            Impostazioni generali dell'applicazione
        </div>

        <div class="option-card">
            <label>
                <input class="align-text-bottom mr-8" type="checkbox" v-model="minimizeOnClose">
                Riduci a icona la finestra invece di chiuderla
            </label>
        </div>
        <div class="option-card">
            <label>
                <input class="align-text-bottom mr-8" type="checkbox" v-model="connectOnStartup">
                Connetti automaticamente all'avvio all'ultimo server utilizzato
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';

const minimizeOnClose = ref(window.settings.get('app.minimizeOnClose', false));
const connectOnStartup = ref(window.settings.get('app.connectOnStartup', false));

watch(minimizeOnClose, (value) => {
    window.settings.set('app.minimizeOnClose', value);
});
watch(connectOnStartup, (value) => {
    window.settings.set('app.connectOnStartup', value);
});
</script>
