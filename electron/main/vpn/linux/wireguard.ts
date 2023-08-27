import sudo from 'sudo-prompt';
import {WireGuard} from '../wireguard';
import {DATA_PATH} from '../../globals';

export class WireGuardLinux extends WireGuard {
    constructor(
        private ip: string,
        private port: number,
        private privateKey: string,
        private publicKey: string,
        private internalIp: string,
        private ips: string[],
        private isIpsAllowlist: boolean,
        private dns: string[]
    ) {
        super();
    }

    async start(): Promise<void> {
        this.writeConfig('dicyvpn.conf');
        sudo.exec(`wg-quick up "${DATA_PATH}/dicyvpn.conf"`, {
            name: 'DicyVPN'
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[WireGuard] error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`[WireGuard stderr] ${stderr}`);
                return;
            }
            console.log(`[WireGuard stdout] ${stdout}`);
        });
    }

    protected getConfig(): string {
        let allowedIPs = 'AllowedIPs = ';
        if (this.ips.length > 0) { // enable split tunneling for IPs
            if (this.isIpsAllowlist) { // allowlist
                allowedIPs += this.ips.join(', ');
            }
        } else {
            allowedIPs += '0.0.0.0/0';
        }
        // route all IPv6 traffic, prevents leaks through IPv6
        allowedIPs += ', ::/0';

        return `
            [Interface]
            PrivateKey = ${this.privateKey}
            Address = ${this.internalIp}/32
            DNS = ${this.dns.join(', ')}

            [Peer]
            PublicKey = ${this.publicKey}
            Endpoint = ${this.ip}:${this.port}
            PersistentKeepalive = 15
            ${allowedIPs}`;
    }
}
