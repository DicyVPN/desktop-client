<template>
    <div class="w-full include-sidebar flex flex-col gap-8 p-8">
        <div class="option-title">
            <p>SplitTunneling</p>
        </div>

        <div class="option-card">

            <div class="flex gap-4">
                <input type="radio" name="tunneling-options" id="allow" :checked="getAuthorization() === 'allow'" @change="changeAuthorization('allow')">
                <label for="allow">Utilizza la DicyVPN solo su queste app/IP</label>
            </div>
            <div class="flex gap-4">
                <input type="radio" name="tunneling-options" id="deny" :checked="getAuthorization() === 'deny'" @change="changeAuthorization('deny')">
                <label for="deny">Vieta a queste app/IP di usare la DicyVPN</label>
            </div>
        </div>

        <div class="option-card">
            <div class="flex gap-8 items-center">
                <span class="mr-auto">Lista Applicazioni</span>
                <input class="file-input" type="file" @change="addApp"/>
            </div>
            <div class="inner-div card-inner bg-gray-600 p-8 rounded mt-8">
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
                <span class="mr-auto">Lista Indirizzi IP</span>
                <input type="text" placeholder="Aggiungi un indirizzo IP" v-model="ipToAdd">
                <Button theme="dark" color="blue" class="p-4 button" @click="addIp()">Aggiungi</Button>
            </div>
            <div class="inner-div card-inner bg-gray-600 p-8 rounded mt-8">
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

import {defineComponent} from "vue";
import Button from "@/components/icons/Button.vue";
import Message from "@/components/options/Message.vue";
import {throwError, throwSuccess} from "@/global";
import {useSettingsStore} from "@/stores/settings";


export default defineComponent({
    components: {Message, Button},
    data() {
        return {
            authorization: this.getAuthorization(),
            appList: [],
            ipList: [],
            ipToAdd: "",
        }
    },
    setup() {
        const settings = useSettingsStore()
        return {settings}
    },
    mounted() {
        this.appList = this.settings.splitTunneling.appList;
        this.ipList = this.settings.splitTunneling.ipList;
    },
    methods: {
        getAuthorization() {
            return this.settings.splitTunneling.authorization
        },
        async addApp(e) {
            let files = e.target.files;
            for (let i of files) {
                console.log(i);
                this.appList.push({
                    name: i.name,
                    path: i.path,
                    enabled: true,
                    icon: await window.api.getIcon(i.path)
                });
                this.saveChange();
            }
        },
        addIp() {
            let ip = this.ipToAdd.split("/")

            if (this.checkIpExist(ip)) {
                throwError("L'indirizzo IP inserito è già presente")
                return;
            }


            switch (window.api.isIp(ip[0])) {
                case 0:
                    throwError("L'indirizzo IP inserito non è valido")
                    return;
                case 4:
                    if (ip[1] > 32) {
                        throwError("La subnet mask inserita non è valida")
                        return;
                    } else {
                        this.ipToAdd = ip[0] + "/" + (ip[1] ?? "32");
                        throwSuccess("Indirizzo IP aggiunto con successo")
                    }
                    break;
                case 6:
                    if (ip[1] > 128) {
                        throwError("La subnet mask inserita non è valida")
                        return;
                    } else {
                        this.ipToAdd = ip[0] + "/" + (ip[1] ?? "128");
                        throwSuccess("Indirizzo IP aggiunto con successo")
                    }
                    break;
            }
            this.ipList.push({
                ip: this.ipToAdd,
                enabled: true
            })
            this.saveChange()
            this.ipToAdd = ""


            // Test ip:
            //  10.0.0.1     : 4
            //  0.0.0.0      : 4
            //  10.0.0.1/24  : 0
            //  ff02::1      : 6
        },

        checkIpExist(ipToCheck) {
            for (let ip of this.ipList) {
                if (ipToCheck[0] === ip.ip.split("/")[0]) return true;
            }
            return false;
        },

        changeAuthorization(authorization) {
            this.authorization = authorization
            this.saveChange()
        },

        delIp(ip) {
            this.ipList.splice(this.ipList.indexOf(ip), 1)
            this.saveChange()
        },
        delApp(name) {
            this.appList.splice(this.appList.indexOf(name), 1)
            this.saveChange()
        },


        saveChange() {
            this.settings.$patch({
                splitTunneling: {
                    authorization: this.authorization,
                    appList: this.appList,
                    ipList: this.ipList
                }
            })
        }
    }
})
</script>

<style scoped>

.option-title {
    @apply option-card flex justify-center;
}

.option-card {
    @apply bg-gray-700 p-8 rounded shadow-lg;
}

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

.button {
    @apply min-w-[theme('spacing.80')];
}

.file-input {
    @apply rounded cursor-pointer dark:text-gray-200  focus:bg-gray-300 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-200;
}

.file-input::-webkit-file-upload-button {
    @apply bg-blue-500 rounded border-none text-white shadow-md px-4 py-2;
}


</style>
