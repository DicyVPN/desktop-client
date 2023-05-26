export function genOpenVPN(ip: string, port: number, protocol: string): string {
    return `client
dev tun
remote ${ip} ${port} ${protocol}
auth-user-pass vpn-user
auth-nocache
nobind
auth SHA256
cipher AES-256-GCM
tls-client
tls-cipher TLS-ECDHE-ECDSA-WITH-AES-256-GCM-SHA384
remote-cert-eku "TLS Web Server Authentication"
persist-key
persist-tun
compress lz4-v2

<tls-crypt>
#
# 2048 bit OpenVPN static key
#
-----BEGIN OpenVPN Static key V1-----
5a406c73bc41f6765ee9f7e082155b66
c7cff844c57e04528166f3b5b3c20330
36ab9a3ef4b8734b938e1e2650be9656
8ec1b72cf32bbe67cc3cf6b87be007b4
10f49fae4266bdbb23925edc725995bc
eaebd017b072738dac55c3309c735a43
7b05c64f4ffcb214ecb4b5ed470f768c
e667f3f678c5da89be34917be1324fde
d515c0ca61762b8a60846ae8939452ec
c9b0dd4bc28df79e8dd9ac975f9098c3
7140c326deee3ed61ce5402cc2ae0293
3a56f68ac2b1148ba661af4970f2c654
791e7cbbf13da7b5819355bd6f43e1b9
93cafbf035d4a187bc9ee3175e706563
3f5ae8f6356b3d33f18dd831235a03d7
a6eea38085fed6927e9a604b82c3ccc1
-----END OpenVPN Static key V1-----
</tls-crypt>

<ca>
-----BEGIN CERTIFICATE-----
MIIB6TCCAW+gAwIBAgIJAO7HEvJxfUUCMAoGCCqGSM49BAMCMBcxFTATBgNVBAMM
DDMyMWludGVyLm5ldDAeFw0xOTA1MjExMzI3NDlaFw0yOTA1MTgxMzI3NDlaMBcx
FTATBgNVBAMMDDMyMWludGVyLm5ldDB2MBAGByqGSM49AgEGBSuBBAAiA2IABGja
TAidcTxY9ud7w3Jr1y6BSS7trkeu3kZqDg/TDCxE4k0Ay6AXVkooORyidfco+SGx
zR8oxcit7JGjCf5+JCufjKjl3s/yULt7gYfQnfBYN4ULcr1gpKCZQMIlORnvHaOB
hjCBgzAdBgNVHQ4EFgQUThoKRpgMcQwcQwlfjfzf5vE2mOUwRwYDVR0jBEAwPoAU
ThoKRpgMcQwcQwlfjfzf5vE2mOWhG6QZMBcxFTATBgNVBAMMDDMyMWludGVyLm5l
dIIJAO7HEvJxfUUCMAwGA1UdEwQFMAMBAf8wCwYDVR0PBAQDAgEGMAoGCCqGSM49
BAMCA2gAMGUCMCL6jOfO1j5lC6q0DN5Z8Aw0GQ5SAFlmlvyAkk1/dGSgA1gzV5/T
4c53qemB1vz4SQIxAN7onHBiSvGwnCePjDSoonHA9CUlWUX9hurwIdFFqLWyRQHn
Nqxoy1tXLIfKApc8CQ==
-----END CERTIFICATE-----
</ca>`

}

export function genWireGuard(ip: string, port: number, privateKey: string, publicKey: string, internalIp: string): string {
    let ipFilter: string = "AllowedIPs = 0.0.0.0/1, 128.0.0.0/1"
    let appFilter: string = ""

    let splitTunneling = JSON.parse(localStorage.getItem("settings") || "{}").splitTunneling

    if (splitTunneling) {
        if (splitTunneling.authorization === "allow") {
            if (splitTunneling.ips.length > 0) {
                ipFilter = "AllowedIPs = "
                for (let ip of splitTunneling.ips) {
                    ipFilter += `${ip},`
                }

            }

            if (splitTunneling.appList.length > 0) {
                appFilter = "AllowedApps = "
                for (let app of splitTunneling.appList) {
                    appFilter += `${app.name},`
                }

                appFilter += "dicyvpn.exe,"
            }

        } else if (splitTunneling.authorization === "deny") {
            if (splitTunneling.ipList.length > 0) {
                ipFilter = "DisallowedIPs = "
                for (let ip of splitTunneling.ips) {
                    ipFilter += `${ip},`
                }

            }

            if (splitTunneling.appList.length > 0) {
                appFilter = "DisallowedApps = "
                for (let app of splitTunneling.appList) {

                    //non devo mettere la virgola all'ultimo elemento
                    appFilter += `${app.name},`

                }
            }
        }
        appFilter = appFilter.substring(0, appFilter.length - 1);
        ipFilter = ipFilter.substring(0, ipFilter.length - 1);

    }


    return `
    [Interface]
    PrivateKey = ${privateKey}
    Address = ${internalIp}/32
    DNS = 1.1.1.1, 1.0.0.1

    [Peer]
    PublicKey = ${publicKey}
    Endpoint = ${ip}:${port}
    PersistentKeepalive = 15
    ${ipFilter}
    ${appFilter}`
}



