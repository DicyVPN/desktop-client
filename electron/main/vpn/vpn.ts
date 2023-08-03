import {sendToRenderer, stopVPN, updateTray} from '../index';
import settings from '../settings';
import {WireGuard} from './wireguard';
import {OpenVPN} from './openvpn';
import {OpenVPNMonitor, setCurrentMonitor, WireGuardMonitor} from './monitor';
import {Status} from './status';
import {createApi} from '../../../common/api';
import {INVALID_REFRESH_TOKEN} from '../../../common/channels';
import {WireGuardWindows} from './windows/wireguard';
import {WireGuardLinux} from "./linux/wireguard";

export interface VPN {
    start(): Promise<void>;
}

const api = createApi(settings, () => sendToRenderer(INVALID_REFRESH_TOKEN));

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
            ips, isIpsAllowlist, apps, isAppsAllowlist
        );

        await wireguard.start();

        setCurrentMonitor(new WireGuardMonitor(Status.CONNECTING, status => sendToRenderer('status-change', status)));
        updateTray(true);
        console.log('WireGuard instance started');

        const previousServer = settings.get('lastServer');
        settings.set('lastServer', {
            id,
            type,
            protocol: 'wireguard'
        });
        await sendDisconnect(previousServer as any);
    } catch (e) {
        await stopVPN(false);
        console.warn('Forcefully stopped VPN due to an error while connecting', e);
        throw e;
    }
}

export async function connectToOpenVPN(id: string, type: string) {
    const info = await api.post<any>('/v1/servers/connect/' + id, {'type': type, 'protocol': 'openvpn'});

    await stopVPN(true);

    console.log('Connecting to an OpenVPN server', id, type, info);
    const openvpn = new OpenVPN(info.serverIp, info.ports.openvpn.tcp[0], 'tcp', info.username, info.password);

    await openvpn.start();

    setCurrentMonitor(new OpenVPNMonitor(Status.CONNECTING, status => sendToRenderer('status-change', status)));
    updateTray(true);
    console.log('OpenVPN instance started');

    const previousServer = settings.get('lastServer');
    settings.set('lastServer', {
        id,
        type,
        protocol: 'openvpn'
    });
    await sendDisconnect(previousServer as any);
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

function getNewWireGuardInstance(serverIp: string, port: number, privateKey: string, publicKey: string, internalIp: string, ips: string[], isIpsAllowlist: boolean, apps: string[], isAppsAllowlist: boolean): WireGuard {
    switch (process.platform) {
        case 'win32':
            return new WireGuardWindows(serverIp, port, privateKey, publicKey, internalIp, ips, isIpsAllowlist, apps, isAppsAllowlist);
        case 'linux':
            return new WireGuardLinux(serverIp, port, privateKey, publicKey, internalIp, ips, isIpsAllowlist, apps, isAppsAllowlist);
    }
    throw new Error('Unsupported platform');
}
