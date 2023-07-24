import {spawnSync} from 'child_process';

const userDataPath = process.env.APPDATA ?? (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');
export const DATA_PATH = userDataPath + '/DicyVPN';
export const EXECUTABLE_NAME = 'DicyVPN.exe';

export const PID_FILE_WIREGUARD = DATA_PATH + '/wireguard.pid';
export const PID_FILE_OPENVPN = DATA_PATH + '/openvpn.pid';

export const DOT_LOG_OPENVPN = 'openvpn.log';
export const LOG_FILE_OPENVPN = DATA_PATH + '/' + DOT_LOG_OPENVPN;

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
