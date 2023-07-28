const apiUrl = 'https://api.dicyvpn.com';

export async function apiGet(path: string, shouldRefreshToken = true): Promise<Response> {
    return await fetch(apiUrl + path, {
        method: 'GET',
        headers: await getHeaders()
    }).then(async (res) => {
        if (res.status === 401 && shouldRefreshToken) {
            return apiRefresh(await getRefreshToken()).then(() => {
                return apiGet(path, false);
            });
        }
        if (!res.ok) {
            throw new ResponseError(await res.text(), res);
        }
        return res;
    });
}

export async function apiPost(path: string, body: any, shouldRefreshToken = true): Promise<Response> {
    return await fetch(apiUrl + path, {
        method: 'POST',
        body: body,
        headers: await getHeaders()
    }).then(async (res) => {
        if (res.status === 401 && shouldRefreshToken) {
            return apiRefresh(await getRefreshToken()).then(() => {
                return apiPost(path, body, false);
            });
        }
        if (!res.ok) {
            throw new ResponseError(await res.text(), res);
        }
        return res;
    });
}

async function apiRefresh(rToken: string) {
    let res = await fetch(apiUrl + '/v1/public/refresh-token', {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({
            refreshToken: rToken,
            refreshTokenId: await getRefreshTokenId(),
            accountId: await getAccountId()
        })
    });

    if (res.status === 401) {
        console.debug('Refresh Token expired');
        await window.settings.set('auth', null);
        return;
    }

    if (!res.ok) {
        console.debug('Error refreshing token');
    }

    const newToken = await res.headers.get('X-Auth-Token') || '';
    await setNewToken(newToken);
}

async function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (await getToken() || '')
    };
}

export async function getRefreshToken(): Promise<string> {
    return await window.settings.get('auth.refreshToken', '');
}


async function getToken(): Promise<string | null> {
    return await window.settings.get('auth.token', null);
}

async function getAccountId(): Promise<string | null> {
    return await window.settings.get('auth.accountId', null);
}

async function getRefreshTokenId(): Promise<string | null> {
    return await window.settings.get('auth.refreshTokenId', null);
}

export async function getPrivateKey(): Promise<string | null> {
    return await window.settings.get('auth.privateKey', null);
}

async function setNewToken(token: string) {
    await window.settings.set('auth.token', token);
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
