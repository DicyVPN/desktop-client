import {spawnSync} from 'child_process';
import {app} from 'electron';

export const DATA_PATH = app.getPath('userData');
export const EXECUTABLE_NAME = app.getPath('exe');

export const PID_FILE_WIREGUARD = DATA_PATH + '/wireguard.pid';
export const PID_FILE_OPENVPN = DATA_PATH + '/openvpn.pid';

export const DOT_LOG_OPENVPN = 'openvpn.log';
export const LOG_FILE_OPENVPN = DATA_PATH + '/' + DOT_LOG_OPENVPN;

export const DEFAULT_DNS = ['1.1.1.1', '1.0.0.1'];

export function getWireGuardClientPath() {
    if (process.platform !== 'win32') {
        throw new Error('WireGuard is only supported on Windows');
    }
    const execution = spawnSync('reg', ['query', '"HKEY_LOCAL_MACHINE\\SOFTWARE\\NTKernelResources\\WinpkFilterForVPNClient"', '/v', 'InstallLocation'], {
        encoding: 'utf8',
        shell: true
    });
    const split = execution.stdout.split('\r\n')[2].split('    ');
    const path = split[split.length - 1];
    return path + 'bin\\wiresock-client.exe';
}

export function getOpenVPNServicePath() {
    if (process.platform !== 'win32') {
        throw new Error('OpenVPN is only supported on Windows');
    }
    return '\\\\.\\pipe\\openvpn\\service';
}
