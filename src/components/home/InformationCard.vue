<template>
    <div class="bg-gray-600 p-8 rounded m-8 flex gap-4">
        <div class="flex flex-col gap-4">
            <div class="information">
                <p class="info-label">IP:</p>
                <p class="info-value">{{ ip }}</p>
            </div>


            <div class="information">
                <p class="info-label">Latenza:</p>
                <p class="info-value">{{ latency }}ms</p>
            </div>

        </div>

        <div class="flex flex-col gap-4 flex-1">
            <div class="information">
                <p class="info-label">Uptime:</p>
                <p class="info-value">{{ uptime }}</p>
            </div>
            <div class="information">
                <p class="info-label">Scaricati:</p>
                <p class="info-value">301,69 MB</p>
                <p class="info-label">Inviati:</p>
                <p class="info-value">51,15 MiB</p>
            </div>
        </div>
    </div>
</template>
<script>
import {useInformationStore} from "@/stores/information";
import {refreshIp} from "../../../common/api";
import {useCurrentServerStore} from "@/stores/currentServer";
import {connectionTime} from "@/global";
import {Status} from '../../../electron/main/vpn/status';

export default {
    name: 'InformationCard',
    data() {
        return {
            latency: 0,
            intervalIp: null,
            intervalPing: null,
            intervalTimer: null,
            connectionTime,
            uptime: ""
        }
    },
    mounted() {
        this.getPing();
        this.intervalPing = setInterval(this.getPing, 4000);
        this.intervalTimer = setInterval(() => this.uptime = this.refreshTime(), 1000);

        this.intervalIp = setInterval(this.refreshIp, 10000)
    },
    unmounted() {
        clearInterval(this.intervalPing);
        clearInterval(this.intervalTimer);
        clearInterval(this.intervalIp);
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
        "currentServer.status"(status) {
            refreshIp()

            if (status === Status.CONNECTED) {
                this.connectionTime.time = new Date().getTime();
            } else {
                this.information.$patch({
                    ip: "..."
                });
                this.connectionTime.time = 0;
            }
        }
    },
  computed: {
    ip() {
      return this.information.ip.length > 27 ? this.information.ip.substring(0, 24) + '...' : this.information.ip;
    }
  }
}
</script>
<style>
.information {
    @apply bg-gray-800 p-4 px-8 rounded flex gap-4;
}

.info-label {
    @apply text-gray-300;
}

.info-value {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: all;
}
</style>
