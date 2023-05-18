const apiUrl = "https://api.dicyvpn.com"

export function apiGet(path: string, shouldRefreshToken = true): Promise<Response> {
    return fetch(apiUrl + path, {
        method: 'GET',
        headers: getHeaders()
    }).then((res) => {
        if (res.status === 401 && shouldRefreshToken) {
            return apiRefresh(getRefreshToken()).then(() => {
                return apiGet(path, false)
            })
        }
        return res
    })
}

export function apiPost(path: string, body: any, shouldRefreshToken = true): Promise<Response> {
    return fetch(apiUrl + path, {
        method: 'POST',
        body: body,
        headers: getHeaders()
    }).then((res) => {
        if (res.status === 401 && shouldRefreshToken) {
            return apiRefresh(getRefreshToken()).then(() => {
                return apiPost(path, body, false)
            })
        }
        return res
    })
}

async function apiRefresh(rToken: string) {
    let res = await fetch(apiUrl + "/v1/public/refresh-token", {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            refreshToken: rToken,
            refreshTokenId: getRefreshTokenId(),
            accountId: getAccountId()
        })
    })

    if (res.status === 401) {
        console.debug("Refresh Token expired")

        localStorage.removeItem('token')
        return
    }

    if (!res.ok) {
        console.debug("Error refreshing token")
    }

    const newToken = await res.headers.get('X-Auth-Token') || '';
    setNewToken(newToken)
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + (getToken() || ""),
    };
}

function getRefreshToken(): string {
    return JSON.parse(localStorage.getItem("token") || "{}").refreshToken
}


function getToken(): string {
    return JSON.parse(localStorage.getItem("token") || "{}").token
}

function getAccountId(): string {
    return JSON.parse(localStorage.getItem("token") || "{}").accountId
}

function getRefreshTokenId(): string {
    return JSON.parse(localStorage.getItem("token") || "{}").refreshTokenId
}

export function getPrivateKey(): string {
    return JSON.parse(localStorage.getItem("token") || "{}").privateKey
}

function setNewToken(token: string) {
    localStorage.setItem("token", JSON.stringify({
        token: token,
        refreshToken: getRefreshToken(),
        refreshTokenId: getRefreshTokenId(),
        accountId: getAccountId(),
        privateKey: getPrivateKey()
    }))
}

export async function refreshIp() {
    let ip = '';

    await fetch('https://dicyvpn.com/cdn-cgi/trace')
        .then(response => response.text())
        .then(text => {
            text.split('\n').forEach(line => {
                line.split('=').forEach((value, index) => {
                    if (value === 'ip') {
                        ip = (line.split('=')[1])
                    }
                })
            })
        })

    return ip

}
