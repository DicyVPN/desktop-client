<template>
    <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen select-none">
        <div class="bg-gray-600 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg w-256">
            <router-link to="/home" class="back">
                <font-awesome-icon icon="fa-solid fa-arrow-left"/>
                <p>Indietro</p>
            </router-link>
            <OptionTitle title="Impostazioni" to="/settings/general"/>
            <OptionTitle title="Split Tunneling" to="/settings/split-tunneling"/>

            <div class="mt-auto">
                <p class="bottom-link" @click="openLink('https://dicyvpn.com/account')">Impostazioni Account</p>
                <p class="bottom-link text-red-300 hover:text-red-200" @click="$refs.logoutConfirm.showModal()">Logout</p>
            </div>
            <dialog ref="logoutConfirm" class="rounded shadow-4">
                <p>Sei sicuro di voler uscire?</p>
                <div class="flex gap-12 mt-12 justify-end">
                    <button class="font-semibold text-gray-500 hover:text-gray-700" @click="$refs.logoutConfirm.close()">Annulla</button>
                    <Button size="normal" color="blue" theme="dark" @click="logout()" :disabled="loadingLogout"><span>Sì</span></Button>
                </div>
            </dialog>
        </div>

        <router-view class="p-8"></router-view>
    </div>
</template>

<script>
import OptionTitle from "@/views/OptionTitle.vue";
import Button from "@/components/icons/Button.vue";
import {apiGet} from "@/assets/api";
import {throwError} from "@/global";

export default {
    components: {
        Button,
        OptionTitle
    },
    data() {
        return {
            loadingLogout: false
        }
    },
    methods: {
        logout() {
            if (this.loadingLogout) {
                return;
            }

            this.loadingLogout = true;
            apiGet("/v1/logout").then(() => {
                localStorage.removeItem("token");
                this.$router.push("/login");
            }).catch(e => {
                console.error(e);
                throwError("Logout fallito, controlla la connessione e riprova");
            }).finally(() => {
                this.loadingLogout = false;
            });
        },
        openLink(link) {
            window.api.externalLink(link);
        },
    }
}


</script>

<style>
.bottom-link {
    @apply font-light text-gray-200 underline underline-offset-2 text-small flex justify-center cursor-pointer
}


.bottom-link:hover {
    @apply text-gray-100
}

.back {
    @apply flex gap-4 items-center ml-8 my-8
}

.back:hover {
    @apply text-gray-200
}
</style>
