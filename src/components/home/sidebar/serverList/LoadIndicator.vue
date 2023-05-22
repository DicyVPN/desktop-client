<template>
    <div class="w-8 h-8 rounded-xsm" :class="color"></div>
</template>
<script>
export default {
    name: 'Load',
    props: {
        load: {
            type: Number,
            required: true
        }
    },
    computed: {
        color() {
            if (this.load > 0.85) {
                return "bg-load-red"
            } else if (this.load > 0.65) {
                return "bg-load-orange"
            } else if (this.load > 0.45) {
                return "bg-load-yellow"
            }else {
                return "bg-load-green"
            }
        }
    }
}
</script>