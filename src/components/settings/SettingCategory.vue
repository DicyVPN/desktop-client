<template>
    <router-link :to="to" class="px-16 py-12 hover:bg-gray-700 cursor-pointer rounded">
        {{ title }}
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
};
</script>

<style scoped>
/*noinspection CssUnusedSymbol*/
.router-link-exact-active {
    @apply bg-gray-700;
}
</style>
