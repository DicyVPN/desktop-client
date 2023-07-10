import fs from 'fs';
import {Tail} from 'tail';
import {LOG_FILE_OPENVPN, PID_FILE_OPENVPN, PID_FILE_WIREGUARD} from '../globals';
import {Status} from './status';

let currentMonitor: Monitor;

export function setCurrentMonitor(monitor: Monitor): void {
    currentMonitor?.stop();
    currentMonitor = monitor;
}

export function getCurrentMonitor(): Monitor {
    return currentMonitor;
}


abstract class Monitor {
    private status: Status;
    private readonly interval: NodeJS.Timer;

    constructor(initialStatus: Status, private changeListener: (status: Status) => void) {
        this.status = initialStatus;
        this.changeListener(initialStatus);
        this.interval = setInterval(() => this.check(), 1000);
    }

    public isRunning(): Status {
        this.check();
        return this.status;
    }

    protected getStatus(): Status {
        return this.status;
    }

    public setStatus(status: Status): void {
        if (this.status !== status) {
            if (this.status === Status.DISCONNECTING && status === Status.CONNECTING) {
                return;
            }

            this.status = status;
            this.changeListener(status);
        }
    }

    protected abstract check(): void;

    stop(): void {
        clearInterval(this.interval);
    }
}

export class WireGuardMonitor extends Monitor {
    private lastPID: number = 0;

    protected check(): void {
        try {
            const pid = Number(fs.readFileSync(PID_FILE_WIREGUARD));

            if (!this.isProcessAlive()) {
                this.setStatus(Status.NOT_RUNNING);
                return;
            }

            if (pid === this.lastPID) {
                this.setStatus(Status.CONNECTED);
                return;
            }

            this.lastPID = pid;
            this.setStatus(Status.CONNECTING);
        } catch (e) {
            this.setStatus(Status.NOT_RUNNING);
        }
    }

    private isProcessAlive(): boolean {
        try {
            process.kill(Number(fs.readFileSync(PID_FILE_WIREGUARD)), 0);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export class OpenVPNMonitor extends Monitor {
    private lastPID = 0;
    private tail: Tail | null = null;
    private initializedSuccessfully = false;

    protected check(): void {
        try {
            const pid = Number(fs.readFileSync(PID_FILE_OPENVPN));
            if (!this.isProcessAlive()) {
                this.tail = null;
                this.initializedSuccessfully = false;
                this.setStatus(Status.NOT_RUNNING);
                return;
            }

            if ((this.lastPID !== pid || !this.tail) && fs.existsSync(LOG_FILE_OPENVPN)) {
                console.debug('[OpenVPN Monitor] Starting log watcher');
                this.tail = new Tail(LOG_FILE_OPENVPN, {
                    fromBeginning: true,
                    useWatchFile: process.platform === 'win32',
                    fsWatchOptions: {interval: 500}
                });
                this.tail.on('line', (line) => {
                    console.debug('[OpenVPN Monitor] ' + line);
                    if (line.includes('Initialization Sequence Completed')) {
                        this.initializedSuccessfully = true;
                        this.setStatus(Status.CONNECTED);
                    }
                });
                this.tail.on('error', (error) => {
                    console.error('[OpenVPN Monitor] ' + error);
                });
            }

            this.lastPID = pid;
            this.setStatus(this.initializedSuccessfully ? Status.CONNECTED : Status.CONNECTING);
        } catch (e) {
            console.error('[OpenVPN Monitor]', e);
            this.setStatus(Status.NOT_RUNNING);
        }
    }

    private isProcessAlive(): boolean {
        try {
            process.kill(Number(fs.readFileSync(PID_FILE_OPENVPN)), 0);
            return true;
        } catch {
            return false;
        }
    }

    stop(): void {
        super.stop();
        this.tail?.unwatch();
    }
}
