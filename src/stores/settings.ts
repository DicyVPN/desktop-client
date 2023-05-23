import {defineStore} from 'pinia'


export const useSettingsStore = defineStore('settings', {
    state: () => {
        if (localStorage.getItem('settings'))
            return JSON.parse(localStorage.getItem('settings') as string);
        return ({
            options: {},
            splitTunneling: {
                authorization : "allow",
                apps : [],
                ips: []
            }
        })
    },
})