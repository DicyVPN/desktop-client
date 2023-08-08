import {spawn} from 'child_process';
import fs from 'fs';
import {WireGuard} from '../wireguard';
import {DATA_PATH, EXECUTABLE_NAME, getWireGuardClientPath, PID_FILE_WIREGUARD} from '../../globals';

export class WireGuardWindows extends WireGuard {

    constructor(
        private ip: string,
        private port: number,
        private privateKey: string,
        private publicKey: string,
        private internalIp: string,
        private ips: string[],
        private isIpsAllowlist: boolean,
        private apps: string[],
        private isAppsAllowlist: boolean,
        private dns: string[]
    ) {
        super();
    }

    async start(): Promise<void> {
        this.writeConfig();
        const exe = getWireGuardClientPath();
        const args = ['run', '-config', `${DATA_PATH}/wireguard.conf`, '-log-level', 'info'];
        const child = spawn(exe, args);
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

    protected getConfig(): string {
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
            DNS = ${this.dns.join(', ')}

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
