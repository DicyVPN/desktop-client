import {ipcMain} from 'electron';
import {WireGuard} from './vpn/vpn';
import {stopVPN, updateTray} from './index';

export function registerAll() {
    // TODO: remove, it is called by the rendered after a connection
    //  because the new system handles connections on the main thread, the event should be called from main to renderer
    ipcMain.on('connection', () => {
        updateTray(true);
    });

    ipcMain.handle('connect-to-wireguard', async (event, args) => {
        await stopVPN();
        console.log('Connecting to a WireGuard server', args);
        const {serverIp, port, privateKey, publicKey, internalIp, ips, isIpsAllowlist, apps, isAppsAllowlist} = args;
        const wireguard = new WireGuard(
            serverIp, port, privateKey, publicKey, internalIp,
            ips, isIpsAllowlist, apps, isAppsAllowlist
        );

        await wireguard.start();
        console.log('WireGuard instance started');
    });

    ipcMain.handle('disconnect', stopVPN);
}
