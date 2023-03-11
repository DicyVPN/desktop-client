import { defineStore } from 'pinia'
import {useLocalStorage} from "@vueuse/core";
export const useCurrentServerStore = defineStore('currentServer', {
    state: () => useLocalStorage('currentServer', {
        connected: false,
        serverTag: 'unknown',
        country: 'unknown',
        city: 'Unknown',
    }),
})

