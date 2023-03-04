<template>
  <div>
    <div class="sidebar-card p-16 rounded grid gap-16">
      <div class="flex items-center gap-8">
        <CheckCircle/>
        <p class="text-small font-light">Connesso</p>
      </div>

      <div class="bg-bright-green w-full h-[1px]"></div>
      <div class="flex w-full">
        <p>Germania</p>
        <div class="flex sr w-full justify-end">
          <div class="flex gap-8">
            <p class="location-text">DE_01</p>
            <Flag :small="false" country="de"/>
          </div>

        </div>
      </div>

      <Button color="red">
        <div>
          Disconnetti
        </div>
      </Button>
    </div>
  </div>
</template>
<script>
import CheckCircle from "@/components/icons/CheckCircle.vue";
import Flag from "@/components/icons/Flag.vue";
import Button from "@/components/icons/Button.vue";

export default {
  name: 'Status',
  components: {
    CheckCircle,
    Flag,
    Button
  }
}
</script>

<style scoped>
.location-text {
  font-size:  0.9375rem; /* 15px */
}
</style>