<template>
    <div class="flex justify-center items-center min-h-screen select-none">
        <div class="inset-0 overflow-hidden absolute mix-blend-overlay opacity-70">
            <img src="@/components/icons/world.svg" class="background-map h-full w-full object-cover">
        </div>
        <div class="bg-gray-600 rounded px-24 py-16 w-320 flex flex-col gap-16 z-10">
            <div class="flex justify-center py-36">
                <font-awesome-icon icon="fa-solid fa-user" class="bg-gray-500 text-blue-100 rounded-full p-28 w-48 h-48 shadow-4"/>
            </div>
            <form class="flex flex-col gap-y-16" @submit.prevent="login">
                <input type="submit" hidden/>
                <div class="flex flex-col gap-y-8">
                    <p class="text-label">Email</p>
                    <input type="text" class="text-input rounded" :class="errorClass" v-model="email">
                    <p v-if="errorClass !== ''" class="text-red-300 font-light font-size-tiny">Credenziali errate</p>
                </div>
                <div class="flex flex-col gap-y-8">
                    <p class="text-label">Password</p>
                    <div class="flex items-stretch justify-end" :class="errorClass">
                        <input :type="type" class="rounded-l text-input password" v-model="password">
                        <div class="show" @click="toggle">
                            <ShowIcon :show="show" class="text-gray-400 top-20%"/>
                        </div>
                    </div>
                </div>
                <Button color="blue" @click="login" class="cursor-pointer" :disabled="loading">
                    <div class="h-33">
                        Accedi
                    </div>
                </Button>
            </form>
            <div class="flex flex-col gap-2">
                <a class="bottom-link" href="https://dicyvpn.com/register" target="_blank">Crea un account</a>
                <a class="bottom-link" href="https://dicyvpn.com/login/request-password-reset" target="_blank">Recupera la password</a>
            </div>
            <div class="flex mt-64 gap-8 justify-center">
                <!--                <img src="@/assets/oauth2/btn_google.svg" alt="logo">-->
                <!--                <img src="@/assets/oauth2/btn_github.svg" alt="logo">-->
                <!--                <img src="@/assets/oauth2/btn_twitter.svg" alt="logo">-->
                <!--                <img src="@/assets/oauth2/btn_facebook.svg" alt="logo">-->
                <!--                <img src="@/assets/oauth2/btn_reddit.svg" alt="logo">-->
            </div>
        </div>
        <dialog ref="dialog" class="rounded shadow-4 p-24">
            <p>{{ dialogMessage }}</p>
            <div class="flex gap-12 mt-12 justify-end">
                <button class="font-semibold text-gray-500 hover:text-gray-700" @click="$refs.dialog.close()">Chiudi</button>
                <Button size="normal" color="blue" theme="dark" @click="openLink(dialogLink)"><span>{{ dialogLinkText }}</span></Button>
            </div>
        </dialog>
    </div>
</template>

<script>
import ShowIcon from '@/views/ShowIcon.vue';
import Button from '@/components/icons/Button.vue';
import WorldMap from '@/components/home/map/WorldMap.vue';
import {ResponseError} from '../../common/api';
import useApi from '@/composables/useApi';

export default {
    components: {WorldMap, Button, ShowIcon},
    data() {
        return {
            show: false,
            type: 'password',
            password: '',
            email: '',
            errorClass: '',
            loading: false,
            dialogMessage: '',
            dialogLink: '',
            dialogLinkText: ''
        };
    },
    methods: {
        toggle() {
            this.show = !this.show;
            this.type = this.show ? 'text' : 'password';
        },
        async login() {
            this.errorClass = '';
            this.loading = true;
            useApi().rawRequest('/v1/public/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: this.email,
                    password: this.password,
                    isDevice: true
                })
            }, false).then(async (res) => {
                    this.loading = false;
                    if (res.ok) {
                        let token = res.headers.get('X-Auth-Token');
                        let refreshToken = res.headers.get('X-Auth-Refresh-Token');
                        let privateKey = res.headers.get('X-Auth-Private-Key');
                        let refreshTokenId = '';
                        let accountId = '';

                        try {
                            const [, payload] = token.split('.');
                            const json = JSON.parse(atob(payload));
                            refreshTokenId = json.refreshTokenId;
                            accountId = json._id;
                        } catch (e) {
                            console.debug('Error parsing token', e);
                        }

                        window.settings.set('auth', {
                            token: token,
                            refreshToken: refreshToken,
                            refreshTokenId: refreshTokenId,
                            accountId: accountId,
                            privateKey: privateKey
                        });

                        this.$router.push({name: 'startup'});
                    } else {
                        if (res.status === 400 || res.status === 401) {
                            this.errorClass = 'border-red-400 border-2 rounded';
                            return;
                        }

                        const e = new ResponseError(await res.text(), res);
                        switch (e.reply.code) {
                            case 'NO_SUBSCRIPTION':
                                this.dialogMessage = 'Non hai un abbonamento attivo';
                                this.dialogLink = 'https://dicyvpn.com/prices';
                                this.dialogLinkText = 'Vedi gli abbonamenti';
                                this.$refs.dialog.showModal();
                                return;
                            case 'DEVICES_LIMIT_REACHED':
                                this.dialogMessage = 'Hai raggiunto il limite di dispositivi';
                                this.dialogLink = 'https://dicyvpn.com/account';
                                this.dialogLinkText = 'Controlla la lista dei dispositivi';
                                this.$refs.dialog.showModal();
                                return;
                        }
                        alert(e.reply.message);
                    }
                }
            ).catch((e) => {
                this.loading = false;
                console.error(e);
                alert('Errore di connessione');
            });
        }
    }
};
</script>

<style scoped>
.background-map {
    transform: scale(1.4);
    transform-origin: center;
}

.text-input:focus {
    outline: transparent none 0;
}

.text-label {
    @apply text-gray-200
}

.text-input {
    @apply w-full h-36 bg-gray-100 text-gray-600 px-16;
}

.text-input.password {
    @apply rounded-r-none
}

.show {
    @apply bg-gray-900 w-[2.5rem] flex items-center justify-center rounded-r cursor-pointer
}

.bottom-link {
    @apply font-light text-gray-200 underline underline-offset-2 text-small
}

dialog::backdrop {
    @apply bg-gray-900 bg-opacity-70
}
</style>
