import {sendToRenderer, stopVPN, updateTray} from '../index';
import settings from '../settings';
import {DEFAULT_DNS} from '../globals';
import {WireGuard} from './wireguard';
import {OpenVPN} from './openvpn';
import {getCurrentMonitor, OpenVPNMonitor, setCurrentMonitor, WireGuardMonitor} from './monitor';
import {Status} from './status';
import {createApi} from '../../../common/api';
import {INVALID_REFRESH_TOKEN} from '../../../common/channels';
import {WireGuardWindows} from './windows/wireguard';

export interface VPN {
    start(): Promise<void>;
}

const api = createApi(settings, () => sendToRenderer(INVALID_REFRESH_TOKEN));
const CONNECT_TIMEOUT = 20000;
export let connectionTimeout: number | NodeJS.Timeout = 0;

type SplitTunneling = {
    authorization?: 'allow' | 'deny';
    appList?: {name: string; path: string, enabled: boolean}[];
    ipList?: {ip: string, enabled: boolean}[];
};

export async function connect(id: string, type: string, protocol: 'wireguard' | 'openvpn', splitTunneling: SplitTunneling) {
    if (protocol === 'wireguard') {
        await connectToWireGuard(id, type, splitTunneling);
    } else {
        await connectToOpenVPN(id, type);
    }
}

export async function connectToWireGuard(id: string, type: string, splitTunneling: SplitTunneling) {
    try {
        const info = await api.post<any>('/v1/servers/connect/' + id, {'type': type, 'protocol': 'wireguard'});

        const ips = (splitTunneling.ipList ?? []).filter((ip: any) => ip.enabled).map((ip: any) => ip.ip);
        const isIpsAllowlist = splitTunneling.authorization === 'allow';
        const apps = (splitTunneling.appList ?? []).filter((app: any) => app.enabled).map((app: any) => app.name);
        const isAppsAllowlist = splitTunneling.authorization === 'allow';

        await stopVPN(true);

        console.log('Connecting to a WireGuard server', id, type, info, ips, isIpsAllowlist, apps, isAppsAllowlist);
        const wireguard = getNewWireGuardInstance(
            info.serverIp, info.ports.wireguard.udp[0], api.getPrivateKey()!, info.publicKey, info.internalIp,
            ips, isIpsAllowlist, apps, isAppsAllowlist, getDns()
        );

        await wireguard.start();

        setCurrentMonitor(new WireGuardMonitor(Status.CONNECTING, status => sendToRenderer('status-change', status)));
        updateTray(true);
        console.log('WireGuard instance started');
        setupConnectionTimeout();

        const previousServer = settings.get('lastServer');
        settings.set('lastServer', {
            id,
            type,
            protocol: 'wireguard'
        });
        await sendDisconnect(previousServer as any);
    } catch (e: any) {
        await stopVPN(false);
        console.warn('Forcefully stopped VPN due to an error while connecting', e, e.message);
        throw e.reply ? JSON.stringify(e.reply) : e.message;
    }
}

export async function connectToOpenVPN(id: string, type: string) {
    try {
        const info = await api.post<any>('/v1/servers/connect/' + id, {'type': type, 'protocol': 'openvpn'});

        await stopVPN(true);

        console.log('Connecting to an OpenVPN server', id, type, info);
        const openvpn = new OpenVPN(info.serverIp, info.ports.openvpn.tcp[0], 'tcp', info.username, info.password, getDns());

        await openvpn.start();

        setCurrentMonitor(new OpenVPNMonitor(Status.CONNECTING, status => sendToRenderer('status-change', status)));
        updateTray(true);
        console.log('OpenVPN instance started');
        setupConnectionTimeout();

        const previousServer = settings.get('lastServer');
        settings.set('lastServer', {
            id,
            type,
            protocol: 'openvpn'
        });
        await sendDisconnect(previousServer as any);
    } catch (e: any) {
        await stopVPN(false);
        console.warn('Forcefully stopped VPN due to an error while connecting', e, e.message);
        throw e.reply ? JSON.stringify(e.reply) : e.message;
    }
}

async function sendDisconnect(server?: {id: string; type: string; protocol: string}) {
    if (!server || server.type !== 'primary' || server.id === settings.get('lastServer.id')) {
        return;
    }

    try {
        console.debug('Sending disconnect request to the server', server);
        await api.post('/v1/servers/disconnect/' + server.id, {
            'type': server.type,
            'protocol': server.protocol
        });
    } catch (e) {
        console.error(e);
    }
}

function getNewWireGuardInstance(serverIp: string, port: number, privateKey: string, publicKey: string, internalIp: string, ips: string[], isIpsAllowlist: boolean, apps: string[], isAppsAllowlist: boolean, dns: string[]): WireGuard {
    switch (process.platform) {
        case 'win32':
            return new WireGuardWindows(
                serverIp, port, privateKey, publicKey, internalIp,
                ips, isIpsAllowlist, apps, isAppsAllowlist, dns
            );
    }
    throw new Error('Unsupported platform');
}

function getDns(): string[] {
    if (settings.get('vpn.useCustomDns')) {
        const dns = settings.get<string[]>('vpn.dns');
        if (dns && dns.length > 0) {
            return dns;
        }
    }
    return DEFAULT_DNS;
}

function setupConnectionTimeout() {
    connectionTimeout = setTimeout(() => {
        if (getCurrentMonitor().isRunning() === Status.CONNECTING) {
            console.warn('Connection timed out, stopping VPN');
            stopVPN(false).then(() => console.log('VPN stopped after connection timeout'));
            sendToRenderer('server-connection-timeout');
        }
    }, CONNECT_TIMEOUT);
}
