<template>
  <div class="bg-gray-600 p-8 rounded m-8 flex gap-4">
    <div class="flex flex-col gap-4">
      <p class="bg-gray-800 p-4 px-8 rounded">IP: 167.86.66.156</p>
      <p class="bg-gray-800 p-4 px-8 rounded">Latenza: 32ms</p>

    </div>

    <div class="flex flex-col gap-4 flex-1">
      <p class="bg-gray-800 p-4 px-8 rounded">UpTime: 1 minuto 51 secondi</p>
      <p class="bg-gray-800 p-4 px-8 rounded">Scaricati: 301,69 MB, Inviati: 51,15 MiB</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InformationCard'
}
</script>