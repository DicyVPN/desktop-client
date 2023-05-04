<template>
    <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen select-none">
        <div class="bg-gray-600 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg w-256">
            <OptionTitle title="Impostazioni" to="/settings/general"/>
            <OptionTitle title="Split Tunneling" to="/settings/split-tunneling"/>

            <div class="mt-auto">
                <p class="bottom-link" @click="openLink('https://dicyvpn.com/account')">Impostazioni Account</p>
                <p class="bottom-link text-red-300 hover:text-red-200" @click="logout()">Logout</p>

            </div>
        </div>

        <router-view class="p-8"></router-view>
    </div>
</template>

<script>
import OptionTitle from "@/views/OptionTitle.vue";

export default {
    components: {
        OptionTitle
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
        },
        openLink(link) {
            window.api.externalLink(link);
        },
    }
}


</script>

<style>
.bottom-link {
    @apply font-light text-gray-200 underline underline-offset-2 text-small flex justify-center
}


.bottom-link:hover {
    @apply text-gray-100
}
</style>