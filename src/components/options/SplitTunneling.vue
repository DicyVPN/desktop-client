<template>
    <div class="w-full include-sidebar flex flex-col gap-8 p-8">
        <div class="option-title">
            <p>SplitTunneling</p>
        </div>

        <div class="option-card">

            <div class="flex gap-4">
                <input type="radio" name="tunneling-options">
                <p>Utilizza la DicyVPN solo su queste app/IP</p>
            </div>
            <div class="flex gap-4">
                <input type="radio" name="tunneling-options">
                <p>Vieta a queste app/IP di usare la DicyVPN</p>
            </div>
        </div>

        <div class="option-card">
            <div class="flex gap-8 items-center">
                <span class="mr-auto">Lista Applicazioni</span>
                <Button theme="dark" color="blue" class="p-4" @click="saveChange()">Aggiungi</Button>
            </div>
            <div class="inner-div card-inner bg-gray-600 p-8 rounded mt-8">
                <div class="flex gap-16" v-for="app in appList" v-if="appList.length > 0">
                    <p>{{ app.iconPath }}</p>
                    <p>{{ app.name }}</p>
                    <div class="ml-auto flex items-center gap-8">
                        <input type="checkbox" :checked="app.enabled">
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
                        <input type="checkbox" :checked="ip.enabled">
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

export default defineComponent({
    components: {Message, Button},
    data() {
        return {
            appList: [],
            ipList: [],
            ipToAdd: "",
        }
    },
    mounted() {

        this.appList = JSON.parse(localStorage.getItem("appList")) || []
        this.ipList = JSON.parse(localStorage.getItem("ipList")) || []
    },
    methods: {
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
                    }
                    else {
                        this.ipToAdd = ip[0] + "/" + (ip[1] ?? "32");
                        throwSuccess("Indirizzo IP aggiunto con successo")
                    }
                    break;
                case 6:
                    if (ip[1] > 128) {
                        throwError("La subnet mask inserita non è valida")
                        return;
                    }
                    else {
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
            for (let ip of JSON.parse(localStorage.getItem("ipList"))) {
                if (ipToCheck[0] === ip.ip.split("/")[0]) return true;
            }
            return false;
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
            localStorage.setItem("appList", JSON.stringify(this.appList))
            localStorage.setItem("ipList", JSON.stringify(this.ipList))
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
</style>