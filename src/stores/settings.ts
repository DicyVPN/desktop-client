import {defineStore} from 'pinia';

type Settings = {
    options: {
        agreedToUseSecondaryServers: boolean;
    },
    splitTunneling: {
        authorization: 'allow' | 'deny';
        appList: {
            name: string;
            path: string;
            enabled: boolean;
        }[];
        ipList: string[];
    }
}

export const useSettingsStore = defineStore('settings', {
    state(): Settings {
        if (localStorage.getItem('settings'))
            return JSON.parse(localStorage.getItem('settings') as string);
        return {
            options: {
                agreedToUseSecondaryServers: false
            },
            splitTunneling: {
                authorization: 'allow',
                appList: [],
                ipList: []
            }
        };
    }
});
