import type {SettingsAPI} from '../electron/main/settings';

const apiUrl = 'https://api.dicyvpn.com';

export const createApi = (settings: SettingsAPI, onInvalidRefreshToken: () => void) => {
    return {
        async get<T>(path: string, isPublic = false): Promise<T> {
            const response = await this.rawRequest(path, {
                method: 'GET'
            }, !isPublic);
            if (!response.ok) {
                throw new ResponseError(await response.text(), response);
            }
            return await response.json();
        },
        async post<T>(path: string, body: any, isPublic = false): Promise<T> {
            const response = await this.rawRequest(path, {
                method: 'POST',
                body: JSON.stringify(body)
            }, !isPublic);
            if (!response.ok) {
                throw new ResponseError(await response.text(), response);
            }
            return await response.json();
        },
        async rawRequest(path: string, options: RequestInit, shouldRefreshToken = true): Promise<Response> {
            const response = await fetch(apiUrl + path, {
                ...options,
                headers: {
                    ...options.headers,
                    ...this.getHeaders()
                }
            });
            if (response.status === 401 && shouldRefreshToken) {
                await this.refreshToken();
                return await this.rawRequest(path, options, false);
            }
            return response;
        },
        async refreshToken() {
            console.debug('Refreshing token');
            const response = await fetch(apiUrl + '/v1/public/refresh-token', {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    refreshToken: settings.get('auth.refreshToken'),
                    refreshTokenId: settings.get('auth.refreshTokenId'),
                    accountId: settings.get('auth.accountId')
                })
            });
            if (response.status === 401) {
                console.debug('Refresh token expired/invalid');
                settings.set('auth', null);
                onInvalidRefreshToken();
                throw new UnauthorizedError('Refresh token is invalid');
            }
            if (!response.ok) {
                throw new ResponseError(await response.text(), response);
            }
            const token = response.headers.get('X-Auth-Token');
            if (token) {
                try {
                    const [, payload] = token.split('.');
                    const json = JSON.parse(atob(payload));
                    const refreshTokenId = json.refreshTokenId;
                    const accountId = json._id;
                    const plan = json.plan;

                    settings.set('auth.refreshTokenId', refreshTokenId);
                    settings.set('auth.accountId', accountId);
                    settings.set('auth.plan', plan);
                } catch (e) {
                    console.debug('Error parsing token', e);
                } finally {
                    settings.set('auth.token', token);
                }
            } else {
                console.debug('No token in response');
                settings.set('auth', null);
            }
        },
        getHeaders() {
            return {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + settings.get('auth.token', '')
            };
        },
        getPrivateKey(): string | null {
            return settings.get('auth.privateKey', null);
        }
    };
};

export type API = ReturnType<typeof createApi>;

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

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}
