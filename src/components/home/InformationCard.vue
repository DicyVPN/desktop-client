<template>
  <div class="bg-gray-600 p-8 rounded m-8 flex gap-4">
    <div class="flex flex-col gap-4">
      <p class="bg-gray-800 p-4 px-8 rounded">IP: {{ information.ip }}</p>
      <p class="bg-gray-800 p-4 px-8 rounded">Latenza: {{latency}}ms</p>

    </div>

    <div class="flex flex-col gap-4 flex-1">
      <p class="bg-gray-800 p-4 px-8 rounded">UpTime: 1 minuto 51 secondi</p>
      <p class="bg-gray-800 p-4 px-8 rounded">Scaricati: 301,69 MB, Inviati: 51,15 MiB</p>
    </div>
  </div>
</template>
<script>
import {useInformationStore} from "@/stores/information";
import {refreshIp} from "@/assets/api";

export default {
  name: 'InformationCard',
  data() {
    return {
      latency: 0,
      intervalId: null
    }
  },
  mounted() {
    this.getPing();
    this.intervalId = setInterval(this.getPing, 3000);

    setInterval(() => {this.refreshIp()}, 10000)
  },
  unmounted() {
    clearInterval(this.intervalId);
  },
  methods: {
    getPing(){
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
    }
  },
  setup() {
    const information = useInformationStore();
    return {
      information
    }
  }
}
</script>