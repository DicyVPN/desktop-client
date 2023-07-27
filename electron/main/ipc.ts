import {ipcMain} from 'electron';
import {sendToRenderer, stopVPN, updateTray} from './index';
import {OpenVPN, WireGuard} from './vpn/vpn';
import {OpenVPNMonitor, setCurrentMonitor, WireGuardMonitor} from './vpn/monitor';
import {Status} from './vpn/status';
import {PID_FILE_OPENVPN, PID_FILE_WIREGUARD} from './globals';
import fs from 'fs';

export function registerAll() {
    // called before any API call, signals to the UI the intent to connect
    ipcMain.handle('before-connect', () => {
        sendToRenderer('status-change', Status.CONNECTING);
    });

    ipcMain.handle('connect-to-wireguard', async (event, args) => {
        await stopVPN(true);

        console.log('Connecting to a WireGuard server', args);
        const {serverIp, port, privateKey, publicKey, internalIp, ips, isIpsAllowlist, apps, isAppsAllowlist} = args;
        const wireguard = new WireGuard(
            serverIp, port, privateKey, publicKey, internalIp,
            ips, isIpsAllowlist, apps, isAppsAllowlist
        );

        await wireguard.start();

        setCurrentMonitor(new WireGuardMonitor(Status.CONNECTING, status => sendToRenderer('status-change', status)));
        updateTray(true);
        console.log('WireGuard instance started');
    });

    ipcMain.handle('connect-to-openvpn', async (event, args) => {
        await stopVPN(true);

        console.log('Connecting to an OpenVPN server', args);
        const {serverIp, port, protocol, username, password} = args;
        const openvpn = new OpenVPN(serverIp, port, protocol, username, password);

        await openvpn.start();
        setCurrentMonitor(new OpenVPNMonitor(Status.CONNECTING, status => sendToRenderer('status-change', status)));
        updateTray(true);
        console.log('OpenVPN instance started');
    });

    ipcMain.handle('disconnect', () => stopVPN());

    ipcMain.handle('is-vpn-alive', (event) => {
        try {
            process.kill(Number(fs.readFileSync(PID_FILE_WIREGUARD)), 0);
            return true;
        } catch {
        }
        try {
            process.kill(Number(fs.readFileSync(PID_FILE_OPENVPN)), 0);
            return true;
        } catch {
        }
        return false;
    });
}
