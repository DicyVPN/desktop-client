<template>
    <div class="flex justify-center items-center min-h-screen">
        <font-awesome-icon icon="fa-solid fa-circle-notch" class="icon-animation h-64 w-64"/>
    </div>
</template>

<script>
export default {
    async mounted() {
        if (window.settings.get('auth.refreshToken')) {
            this.$router.push({name: 'home'});
        } else {
            this.$router.push({name: 'login'});
        }
    }
};
</script>
