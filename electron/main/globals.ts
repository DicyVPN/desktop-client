const userDataPath = process.env.APPDATA ?? (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');
export const DATA_PATH = userDataPath + '/DicyVPN';
export const EXECUTABLE_NAME = 'DicyVPN.exe';

export const PID_FILE_WIREGUARD = DATA_PATH + '/wireguard.pid';
export const PID_FILE_OPENVPN = DATA_PATH + '/openvpn.pid';

export function getWireGuardClientPath() {
    if (process.platform !== 'win32') {
        throw new Error('WireGuard is only supported on Windows');
    }
    const programFiles = process.env['ProgramFiles'] ?? 'C:\\Program Files';
    return programFiles + '\\WireSock VPN Client\\bin\\wiresock-client.exe';
}

export function getOpenVPNServicePath() {
    if (process.platform !== 'win32') {
        throw new Error('OpenVPN is only supported on Windows');
    }
    return '\\\\.\\pipe\\openvpn\\service';
}
