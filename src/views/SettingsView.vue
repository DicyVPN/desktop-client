<template>
    <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen select-none">
        <div class="bg-gray-600 h-screen p-12 flex flex-col gap-8 select-none shadow-4-lg w-256">
            <router-link to="/" class="back">
                <font-awesome-icon icon="fa-solid fa-arrow-left"/>
                <span>Indietro</span>
            </router-link>
            <OptionTitle title="Impostazioni" to="/settings"/>
            <OptionTitle title="Split Tunneling" to="/settings/split-tunneling"/>

            <div class="mt-auto">
                <a class="bottom-link text-gray-200 hover:text-gray-100" href="https://dicyvpn.com/account" target="_blank">Impostazioni Account</a>
                <p class="bottom-link text-red-300 hover:text-red-200 mt-4" @click="$refs.logoutConfirm.showModal()">Logout</p>
            </div>
            <dialog ref="logoutConfirm" class="rounded shadow-4 p-24">
                <p>Sei sicuro di voler uscire?</p>
                <div class="flex gap-12 mt-12 justify-end">
                    <button class="font-semibold text-gray-500 hover:text-gray-700" @click="$refs.logoutConfirm.close()">Annulla</button>
                    <Button size="normal" color="blue" theme="dark" @click="logout()" :disabled="loadingLogout"><span>Sì</span></Button>
                </div>
            </dialog>
        </div>

        <Suspense>
            <RouterView class="p-12" v-slot="{ Component }">
                <template v-if="Component">
                    <Transition mode="out-in">
                        <KeepAlive>
                            <Suspense>
                                <component :is="Component"></component>
                                <template #fallback>
                                    <div class="flex-1 text-center my-32">Caricamento&hellip;</div>
                                </template>
                            </Suspense>
                        </KeepAlive>
                    </Transition>
                </template>
            </RouterView>
        </Suspense>
    </div>
</template>

<script>
import OptionTitle from '@/components/settings/SettingCategory.vue';
import Button from '@/components/icons/Button.vue';
import useApi from '@/composables/useApi';
import {throwError} from '@/global';

export default {
    components: {
        Button,
        OptionTitle
    },
    data() {
        return {
            loadingLogout: false
        };
    },
    methods: {
        logout() {
            if (this.loadingLogout) {
                return;
            }

            this.loadingLogout = true;
            useApi().get('/v1/logout').then(async () => {
                await window.settings.set('auth', null);
                this.$router.push('/login');
            }).catch(e => {
                console.error(e);
                throwError('Logout fallito, controlla la connessione e riprova');
            }).finally(() => {
                this.loadingLogout = false;
            });
        }
    }
};
</script>

<style scoped>
.bottom-link {
    @apply font-light underline underline-offset-2 text-small flex justify-center cursor-pointer
}

.back {
    @apply flex gap-4 items-center ml-8 my-8
}

.back:hover {
    @apply text-gray-200
}

:deep(.option-card) {
    @apply bg-gray-700 p-16 rounded shadow-lg;
}
</style>
