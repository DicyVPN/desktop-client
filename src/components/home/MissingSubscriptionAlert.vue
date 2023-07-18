<template>
    <dialog ref="dialog" class="rounded shadow-4 p-24">
        <h3 class="font-semibold mb-4">Non hai un abbonamento attivo</h3>
        <div>
            Visita <span class="underline text-blue-600 hover:text-blue-700 cursor-pointer" @click="openLink">dicyvpn.com/prices</span> per poter utilizzare DicyVPN
        </div>
        <div class="flex gap-12 mt-12 justify-end">
            <button class="font-semibold text-gray-500 hover:text-gray-700" @click="showMissingSubscription = false">
                Chiudi
            </button>
        </div>
    </dialog>
</template>

<script>
import {showMissingSubscription} from '@/global';

export default {
    data() {
        return {
            showMissingSubscription
        };
    },
    methods: {
        openLink() {
            window.api.externalLink('https://dicyvpn.com/prices')
        }
    },
    watch: {
        showMissingSubscription() {
            if (this.showMissingSubscription) {
                this.$refs.dialog.showModal();
            } else {
                this.$refs.dialog.close();
            }
        }
    }
};
</script>
