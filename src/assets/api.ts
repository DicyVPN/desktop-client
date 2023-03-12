const apiUrl = "https://api.dicyvpn.com"

export function apiGet(path: string): Promise<Response>{
    return fetch(apiUrl + path, {
        method: 'GET',
        headers: getHeaders()
    }).then((res) => {
        if (res.status === 401) {
            apiRefresh(getRefreshToken()).then(async () => {
                return await apiGet(path)
            })
        }
        return res
    })
}
export function apiPost(path: string, body: any): Promise<Response>{
    return fetch(apiUrl + path, {
        method: 'POST',
        body: body,
        headers: getHeaders()
    }).then((res) => {
        if (res.status === 401) {
            apiRefresh(getRefreshToken()).then(async () => {
                return await apiGet(path)
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
        "Authorization": "Bearer " + (localStorage.getItem("token") || ""),
    };
}

function getRefreshToken(): string {
    return JSON.parse(localStorage.getItem("token") as string).refreshToken
}

// Function to get elements from local storage

// function getToken(): string {
//     return JSON.parse(localStorage.getItem("token") as string).token
// }
 function getAccountId(): string {
     return JSON.parse(localStorage.getItem("token") as string).accountId
 }
 function getRefreshTokenId(): string {
     return JSON.parse(localStorage.getItem("token") as string).refreshTokenId
 }

 function setNewToken(token: string) {
     localStorage.setItem("token", JSON.stringify({token: token, refreshToken: getRefreshToken(), refreshTokenId: getRefreshTokenId(), accountId: getAccountId()} ))
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
                        console.log(ip)

                    }
                })
            })
        })

    return ip

}