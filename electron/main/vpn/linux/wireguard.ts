import { spawn } from 'child_process';
import fs from 'fs';
import { WireGuard } from '../wireguard';
import {DATA_PATH, EXECUTABLE_NAME, getWireGuardClientPath, PID_FILE_WIREGUARD} from '../../globals';

export class WireGuardLinux extends WireGuard {
    constructor(
        private ip: string,
        private port: number,
        private privateKey: string,
        private publicKey: string,
        private internalIp: string,
        private ips: string[],
        private isIpsAllowlist: boolean,
        private apps: string[],
        private isAppsAllowlist: boolean
    ) {
        super();
    }

    async start(): Promise<void> {
        this.writeConfig();
        const child = spawn('wg-quick', ['up', 'wireguard']); // Adjust the 'wireguard' to your connection name.
        if (child.pid) {
            fs.writeFileSync(PID_FILE_WIREGUARD, child.pid.toString());
        }
        child.stdout.on('data', (data) => {
            console.log(`[WireGuard stdout] ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`[WireGuard stderr] ${data}`);
        });
    }

    async stop(): Promise<void> {
        // First, check if the PID_FILE_WIREGUARD exists and contains a valid PID
        if (fs.existsSync(PID_FILE_WIREGUARD)) {
            const pid = parseInt(fs.readFileSync(PID_FILE_WIREGUARD, 'utf8'));
            if (pid) {
                try {
                    // Use SIGTERM to stop the process gracefully
                    process.kill(pid, 'SIGTERM');
                    fs.unlinkSync(PID_FILE_WIREGUARD);
                    console.log(`WireGuard process with PID ${pid} has been stopped.`);
                } catch (err) {
                    console.error('Error stopping WireGuard process:', err);
                }
            } else {
                console.warn('Invalid PID in the PID_FILE_WIREGUARD.');
            }
        } else {
            console.warn('PID_FILE_WIREGUARD does not exist.');
        }
    }

    protected getConfig(): string {
        // ... (rest of the getConfig() implementation as before)
        let disallowedIPs = '';
        let allowedIPs = 'AllowedIPs = ';
        if (this.ips.length > 0) { // enable split tunneling for IPs
            if (this.isIpsAllowlist) { // allowlist
                allowedIPs += this.apps.join(',');
            } else { // denylist
                disallowedIPs = 'DisallowedIPs = ' + this.ips.join(',');
                allowedIPs += '0.0.0.0/1, 128.0.0.0/1'; // route all traffic through the VPN
            }
        } else {
            allowedIPs += '0.0.0.0/1, 128.0.0.0/1';
        }
        // route all IPv6 traffic, prevents leaks through IPv6
        allowedIPs += ', ::/0';

        let disallowedApps = 'DisallowedApps = ' + EXECUTABLE_NAME; // don't route the VPN app through the VPN
        let allowedApps = '';
        if (this.apps.length > 0) {
            if (this.isAppsAllowlist) { // allowlist
                allowedApps = 'AllowedApps = ' + this.apps.join(',');
            } else { // denylist
                disallowedApps += ',' + this.apps.join(',');
            }
        }


        return `
            [Interface]
            PrivateKey = ${this.privateKey}
            Address = ${this.internalIp}/32
            DNS = 1.1.1.1, 1.0.0.1

            [Peer]
            PublicKey = ${this.publicKey}
            Endpoint = ${this.ip}:${this.port}
            PersistentKeepalive = 15
            ${allowedIPs}
            ${disallowedIPs}
            ${allowedApps}
            ${disallowedApps}`;
    }
}
