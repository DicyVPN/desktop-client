import { defineStore } from 'pinia'
export const useCurrentServerStore = defineStore('currentServer', {
    state: () => ({
        connected: false,
        serverTag: 'unknown',
        country: 'unknown',
        city: 'Unknown',
    }),
})

