<template>
    <router-link :to="to" class="p-8 sidebar-card option">
        <h1 class="flex justify-center">{{ title }}</h1>
    </router-link>
</template>
<script>
export default {
    name: 'OptionTitle',
    props: {
        title: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: false
        }
    }
}
</script>

<style scoped>

.option:hover {
    @apply bg-gray-700;
    cursor: pointer;
}


</style>