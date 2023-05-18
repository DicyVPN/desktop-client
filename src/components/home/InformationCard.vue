<template>
    <div class="bg-gray-600 p-8 rounded m-8 flex gap-4">
        <div class="flex flex-col gap-4">
            <p class="bg-gray-800 p-4 px-8 rounded" @click="refreshIp()">IP: {{ information.ip }}</p>
            <p class="bg-gray-800 p-4 px-8 rounded">Latenza: {{ latency }}ms</p>

        </div>

        <div class="flex flex-col gap-4 flex-1">
            <p class="bg-gray-800 p-4 px-8 rounded">Up Time: {{ uptime }}</p>
            <p class="bg-gray-800 p-4 px-8 rounded">Scaricati: 301,69 MB, Inviati: 51,15 MiB</p>
        </div>
    </div>
</template>
<script>
import {useInformationStore} from "@/stores/information";
import {refreshIp} from "@/assets/api";
import {useCurrentServerStore} from "@/stores/currentServer";
import {connectionTime} from "@/global";

export default {
    name: 'InformationCard',
    data() {
        return {
            latency: 0,
            intervalId: null,
            connectionTime,
            uptime: 0
        }
    },
    mounted() {
        this.getPing();
        this.intervalId = setInterval(this.getPing, 3000);

        setInterval(() => {
            this.refreshIp()
            this.uptime = this.refreshTime()
        }, 2000)
    },
    unmounted() {
        clearInterval(this.intervalId);
    },
    methods: {
        getPing() {
            const startTime = new Date().getTime();


            let host = 'dicyvpn.com'
            window.ping.sys.probe(host, () => {
                this.latency = new Date().getTime() - startTime;

            });
        },
        refreshIp() {
            refreshIp().then((ip) => {
                this.information.$patch({
                    ip: ip
                })
            })
        },
        refreshTime() {

            if (this.connectionTime.time === 0) return "0h 0m 0s";


            let time = new Date().getTime() - this.connectionTime.time;
            let seconds = Math.floor((time / 1000) % 60);
            let minutes = Math.floor((time / (1000 * 60)) % 60);
            let hours = Math.floor((time / (1000 * 60 * 60)) % 24);

            return `${hours}h ${minutes}m ${seconds}s`
        }
    },
    setup() {
        const currentServer = useCurrentServerStore();
        const information = useInformationStore();
        return {
            currentServer,
            information
        }

    },
    watch: {
        "currentServer.connected"(value) {
            refreshIp()

            if (value === true) {
                this.connectionTime.time = new Date().getTime();
            } else {
                this.connectionTime.time = 0;
            }
        }
    },
}
</script>