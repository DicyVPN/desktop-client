<template>
  <div class="bg-gray-600 p-8 rounded m-8 flex gap-4">
    <div class="flex flex-col gap-4">
      <p class="bg-gray-800 p-4 px-8 rounded">IP: {{ ip }}</p>
      <p class="bg-gray-800 p-4 px-8 rounded">Latenza: {{latency}}ms</p>

    </div>

    <div class="flex flex-col gap-4 flex-1">
      <p class="bg-gray-800 p-4 px-8 rounded">UpTime: 1 minuto 51 secondi</p>
      <p class="bg-gray-800 p-4 px-8 rounded">Scaricati: 301,69 MB, Inviati: 51,15 MiB</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InformationCard',
  data() {
    return {
      ip: '000.000.00.000',
      latency: 0,
      intervalId: null
    }
  },
  mounted() {
    this.getIp();
    this.getPing();
    this.intervalId = setInterval(this.getPing, 3000);
  },
  unmounted() {
    clearInterval(this.intervalId);
  },
  methods: {
    getIp() {
      // devo prendere il testo contenuto nella pagina questo link https://dicyvpn.com/cdn-cgi/trace
      // e poi prendere l'ip

      fetch('https://dicyvpn.com/cdn-cgi/trace')
          .then(response => response.text())
          .then(text => {
            text.split('\n').forEach(line => {
              line.split('=').forEach((value, index) => {
                if (value === 'ip') {
                  this.ip = line.split('=')[1]
                }
              })
            })
          })
    },
    getPing(){
      const startTime = new Date().getTime();


      let host = 'dicyvpn.com'
      window.ping.sys.probe(host, () => {
        this.latency = new Date().getTime() - startTime;

      });

    }
  }
}
</script>