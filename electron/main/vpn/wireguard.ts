import fs from 'fs';
import type {VPN} from './vpn';
import {DATA_PATH} from '../globals';

export abstract class WireGuard implements VPN {

    abstract start(): Promise<void>;

    protected writeConfig(filename: string) {
        const conf = this.getConfig();
        fs.writeFileSync(`${DATA_PATH}/${filename}`, conf);
    }

    protected abstract getConfig(): string;
}
