<template>
    <div class="flex-1 flex flex-col gap-8 p-8">
        <div class="option-card font-light text-gray-200">
            Puoi decidere quali applicazioni o indirizzi IP escludere o includere dalla VPN tramite la funzione Split&nbsp;Tunneling.
            Funziona <b>solo sui server primari</b>.
        </div>

        <div class="option-card">
            <div>
                <input type="radio" name="tunneling-options" id="allow" :checked="getAuthorization() === 'allow'" @change="changeAuthorization('allow')">
                <label for="allow" class="align-text-bottom ml-8">Utilizza DicyVPN solo su queste App/IP</label>
            </div>
            <div>
                <input type="radio" name="tunneling-options" id="deny" :checked="getAuthorization() === 'deny'" @change="changeAuthorization('deny')">
                <label for="deny" class="align-text-bottom ml-8">Vieta a queste App/IP di usare DicyVPN</label>
            </div>
        </div>

        <div class="option-card">
            <div class="flex gap-8 items-center">
                <span>Lista Applicazioni</span>
                <Button class="add-button ml-auto" theme="dark" color="blue" @click="addApp"><span>Aggiungi App</span></Button>
            </div>
            <div class="inner-div card-inner bg-gray-600 p-8 rounded mt-12">
                <div class="flex gap-16 items-center" v-for="app in appList" v-if="appList.length > 0">
                    <img class="w-20 h-20" :src="app.icon" alt="icon">
                    <p>{{ app.name }}</p>
                    <div class="ml-auto flex items-center gap-8">
                        <input type="checkbox" v-model="app.enabled" @change="saveChange()">
                        <font-awesome-icon icon="fa-solid fa-trash" class="hover:text-red-400"
                                           @click="delApp(app.name)"/>
                    </div>
                </div>
                <div class="flex justify-center" v-else>
                    <p class="text-gray-200">Ancora nessuna app inserita</p>
                </div>

            </div>
        </div>

        <div class="option-card">
            <div class="flex gap-8">
                <span>Lista Indirizzi IP</span>
                <input class="ml-auto" type="text" placeholder="127.0.0.1/32" v-model="ipToAdd">
                <Button class="add-button" theme="dark" color="blue" @click="addIp"><span>Aggiungi IP</span></Button>
            </div>
            <div class="inner-div card-inner bg-gray-600 p-8 rounded mt-12">
                <div class="flex" v-for="ip in ipList" v-if="ipList.length > 0">
                    <p>{{ ip.ip }}</p>
                    <div class="ml-auto flex gap-8 items-center">
                        <input type="checkbox" v-model="ip.enabled" @change="saveChange()">
                        <font-awesome-icon icon="fa-solid fa-trash" class="hover:text-red-400" @click="delIp(ip.ip)"/>
                    </div>
                </div>
                <div class="flex justify-center" v-else>
                    <p class="text-gray-200">Ancora nessun IP inserito</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import {defineComponent} from 'vue';
import Button from '@/components/icons/Button.vue';
import Message from '@/components/Message.vue';
import {throwError, throwSuccess} from '@/global';
import {useSettingsStore} from '@/stores/settings';


export default defineComponent({
    components: {Message, Button},
    data() {
        return {
            authorization: this.getAuthorization(),
            appList: [],
            ipList: [],
            ipToAdd: ''
        };
    },
    setup() {
        const settings = useSettingsStore();
        return {settings};
    },
    mounted() {
        this.appList = this.settings.splitTunneling.appList;
        this.ipList = this.settings.splitTunneling.ipList;
    },
    methods: {
        getAuthorization() {
            return this.settings.splitTunneling.authorization;
        },
        addApp() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.click();
            input.addEventListener('change', async () => {
                let files = input.files;
                for (let i of files) {
                    this.appList.push({
                        name: i.name,
                        path: i.path,
                        enabled: true,
                        icon: await window.preload.getIcon(i.path)
                    });
                    this.saveChange();
                }
            });
        },
        addIp() {
            const ip = this.ipToAdd.split('/');

            if (this.checkIpExist(ip)) {
                throwError('L\'indirizzo IP inserito è già presente');
                return;
            }

            switch (window.preload.isIp(ip[0])) {
                case 0:
                    throwError('L\'indirizzo IP inserito non è valido');
                    return;
                case 4:
                    if (ip[1] > 32) {
                        throwError('La subnet mask inserita non è valida');
                        return;
                    } else {
                        this.ipToAdd = ip[0] + '/' + (ip[1] ?? '32');
                        throwSuccess('Indirizzo IP aggiunto con successo');
                    }
                    break;
                case 6:
                    if (ip[1] > 128) {
                        throwError('La subnet mask inserita non è valida');
                        return;
                    } else {
                        this.ipToAdd = ip[0] + '/' + (ip[1] ?? '128');
                        throwSuccess('Indirizzo IP aggiunto con successo');
                    }
                    break;
            }
            this.ipList.push({
                ip: this.ipToAdd,
                enabled: true
            });
            this.saveChange();
            this.ipToAdd = '';
        },
        checkIpExist(ipToCheck) {
            for (let ip of this.ipList) {
                if (ipToCheck[0] === ip.ip.split('/')[0]) return true;
            }
            return false;
        },
        changeAuthorization(authorization) {
            this.authorization = authorization;
            this.saveChange();
        },
        delIp(ip) {
            this.ipList.splice(this.ipList.indexOf(ip), 1);
            this.saveChange();
        },
        delApp(name) {
            this.appList.splice(this.appList.indexOf(name), 1);
            this.saveChange();
        },
        saveChange() {
            this.settings.$patch({
                splitTunneling: {
                    authorization: this.authorization,
                    appList: this.appList,
                    ipList: this.ipList
                }
            });
        }
    }
});
</script>

<style scoped>
.card-inner::-webkit-scrollbar {
    width: 8px;
}

.inner-div {
    overflow-y: scroll;
    @apply max-h-[theme('spacing.192')];
}

.card-inner::-webkit-scrollbar-track {
    border-bottom-right-radius: theme('borderRadius.DEFAULT');
    border-top-right-radius: theme('borderRadius.DEFAULT');
}

.card-inner::-webkit-scrollbar-thumb {
    background: theme('colors.gray.900');
    border-radius: theme('borderRadius.DEFAULT');
}

.card-inner::-webkit-scrollbar-thumb:hover {
    background: black;
}

.add-button {
    @apply min-w-[theme('spacing.192')];
}
</style>
