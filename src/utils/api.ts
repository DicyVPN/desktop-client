import type {Settings} from '../../electron/preload';

const apiUrl = 'https://api.dicyvpn.com';

export async function apiGet(path: string, shouldRefreshToken = true, settings: Settings = window.settings): Promise<Response> {
    return await fetch(apiUrl + path, {
        method: 'GET',
        headers: await getHeaders(settings)
    }).then(async (res) => {
        if (res.status === 401 && shouldRefreshToken) {
            return apiRefresh(await getRefreshToken(settings), settings).then(() => {
                return apiGet(path, false);
            });
        }
        if (!res.ok) {
            throw new ResponseError(await res.text(), res);
        }
        return res;
    });
}

export async function apiPost(path: string, body: any, shouldRefreshToken = true, settings: Settings = window.settings): Promise<Response> {
    return await fetch(apiUrl + path, {
        method: 'POST',
        body: body,
        headers: await getHeaders(settings)
    }).then(async (res) => {
        if (res.status === 401 && shouldRefreshToken) {
            return apiRefresh(await getRefreshToken(settings), settings).then(() => {
                return apiPost(path, body, false, settings);
            });
        }
        if (!res.ok) {
            throw new ResponseError(await res.text(), res);
        }
        return res;
    });
}

async function apiRefresh(rToken: string, settings: Settings) {
    let res = await fetch(apiUrl + '/v1/public/refresh-token', {
        method: 'POST',
        headers: await getHeaders(settings),
        body: JSON.stringify({
            refreshToken: rToken,
            refreshTokenId: await getRefreshTokenId(settings),
            accountId: await getAccountId(settings)
        })
    });

    if (res.status === 401) {
        console.debug('Refresh Token expired');
        await settings.set('auth', null);
        return;
    }

    if (!res.ok) {
        console.debug('Error refreshing token');
    }

    const newToken = await res.headers.get('X-Auth-Token') || '';
    await setNewToken(newToken, settings);
}

async function getHeaders(settings: Settings) {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (await getToken(settings) || '')
    };
}

export async function getRefreshToken(settings: Settings): Promise<string> {
    return await settings.get('auth.refreshToken', '');
}


async function getToken(settings: Settings): Promise<string | null> {
    return await settings.get('auth.token', null);
}

async function getAccountId(settings: Settings): Promise<string | null> {
    return await settings.get('auth.accountId', null);
}

async function getRefreshTokenId(settings: Settings): Promise<string | null> {
    return await settings.get('auth.refreshTokenId', null);
}

export async function getPrivateKey(settings: Settings): Promise<string | null> {
    return await settings.get('auth.privateKey', null);
}

async function setNewToken(token: string, settings: Settings) {
    await settings.set('auth.token', token);
}

export async function refreshIp() {
    let ip = '';

    await fetch('https://dicyvpn.com/cdn-cgi/trace')
        .then(response => response.text())
        .then(text => {
            text.split('\n').forEach(line => {
                line.split('=').forEach((value, index) => {
                    if (value === 'ip') {
                        ip = (line.split('=')[1]);
                    }
                });
            });
        });

    return ip;
}

export class ResponseError extends Error {
    public reply: {
        code: string;
        message: string;
    } = {
        code: 'UNKNOWN',
        message: 'Unknown error'
    };

    constructor(message: string, public response: Response) {
        super(message);
        this.name = 'ResponseError';

        try {
            const json = JSON.parse(message);
            this.message = json;
            if (json.reply && json.reply.code && json.reply.message) {
                this.reply = json.reply;
            }
        } catch (e) {
        }
    }

    get status() {
        return this.response.status;
    }
}
