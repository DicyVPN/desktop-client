<template>
    <div class="flex justify-center items-center min-h-screen">
        <font-awesome-icon icon="fa-solid fa-circle-notch" class="icon-animation h-64 w-64"/>
    </div>
</template>

<script>
import {getRefreshToken} from "@/assets/api";

export default {
    async mounted() {
        if (await getRefreshToken(window.settings)) {
            this.$router.push({name: "home"});
        } else {
            this.$router.push({name: "login"});
        }
    }
}
</script>
