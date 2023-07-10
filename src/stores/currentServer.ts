import {defineStore} from 'pinia';
import {Status} from '../../electron/main/vpn/status';

interface CurrentServer {
    status: Status,
    id: string | null,
    type: 'primary' | 'secondary' | null,
    protocol: 'wireguard' | 'openvpn' | null,
    country: string | null,
    city: string | null,
    name: string | null
}

export const useCurrentServerStore = defineStore('currentServer', {
    state: (): CurrentServer => {
        const json = localStorage.getItem('currentServer');
        if (json) {
            return JSON.parse(json);
        }

        return ({
            status: Status.NOT_RUNNING,
            id: null,
            type: null,
            protocol: null,
            country: null,
            city: null,
            name: null
        });
    }
});

