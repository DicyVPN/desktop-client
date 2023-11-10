<template>
    <div v-if="isLoadingServers" class="flex inset-0 z-50 h-screen w-screen bg-gray-900 opacity-90 absolute justify-center items-center">
        <font-awesome-icon icon="fa-solid fa-circle-notch" class="icon-animation h-64 w-64"/>
    </div>


    <div class="flex flex-1 min-h-screen max-h-screen min-w-screen max-w-screen select-none">
        <Sidebar class="w-256" :list="serverList" :reload="loadServers"/>
        <div class="include-sidebar flex flex-col flex-1">
            <div class="p-8">
                <div class="bg-gray-600 rounded p-8 shadow-4 flex justify-between items-center gap-8">
                    <Logo/>
                    <div class="flex items-center gap-8 mr-4 select-text" v-if="hasUpdate">
                        <div v-if="downloadError">
                            An error occurred while updating. Restart the app or download the latest version from <a href="https://dicyvpn.com/download" target="_blank">dicyvpn.com</a>
                        </div>
                        <div v-else-if="!isDownloading && downloadProgress === 0">
                            An update is available!
                        </div>
                        <div v-else-if="downloadProgress < 100">
                            Downloading update: <span class="font-mono">{{ downloadProgress }}%</span>
                        </div>
                        <template v-else>
                            Update downloaded. Restart the app to apply the update.
                            <Button class="ml-4" theme="dark" color="blue" size="small" @click="installUpdate()"><span>Install</span></Button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-hidden">
                <div class="zoom-container">
                    <font-awesome-icon icon="fa-solid fa-minus" class="icon zoom rounded-bl"
                                       @click="zoomController(false)"/>
                    <font-awesome-icon icon="fa-solid fa-plus" class="icon zoom" @click="zoomController(true)"/>
                </div>
                <WorldMap class="bg-gray-800 shadow-4 overflow-hidden" :map-scale="zoom"/>
            </div>
            <InformationCard/>
        </div>
    </div>

    <Modal :show="showInstallUpdate" title="Disconnect and restart" action-label="Restart" @action="installUpdate()" secondary-label="Cancel" @secondary="showInstallUpdate = false">
        You will be disconnected from the server and the app will restart to apply the update.
    </Modal>
</template>

<script>
import Logo from '@/components/icons/Logo.vue';
import Sidebar from '@/components/home/sidebar/Sidebar.vue';
import InformationCard from '@/components/home/InformationCard.vue';
import WorldMap from '@/components/home/map/WorldMap.vue';
import useApi from '@/composables/useApi';
import Button from '@/components/icons/Button.vue';
import {UPDATE_AVAILABLE, UPDATE_DOWNLOAD_PROGRESS, UPDATE_DOWNLOADED, UPDATE_ERROR} from '../../common/channels';
import Modal from '@/components/Modal.vue';
import {useCurrentServerStore} from '@/stores/currentServer';
import {Status} from '../../electron/main/vpn/status';

const scaleModifier = 0.5;
export default {
    name: 'HomeView',
    components: {Modal, Button, WorldMap, Logo, InformationCard, Sidebar},
    data() {
        return {
            zoom: 1,
            serverList: {
                primary: [],
                secondary: []
            },
            isLoadingServers: false,
            hasUpdate: false,
            isDownloading: false,
            downloadProgress: 0,
            downloadError: false,
            showInstallUpdate: false
        };
    },
    setup() {
        return {
            currentServer: useCurrentServerStore()
        };
    },
    async beforeMount() {
        this.loadServers();

        this.hasUpdate = await window.preload.hasUpdate();
        window.preload.on(UPDATE_AVAILABLE, () => {
            this.hasUpdate = true;
        });
        window.preload.on(UPDATE_DOWNLOAD_PROGRESS, (_, progress) => {
            this.isDownloading = true;
            this.downloadError = false;
            this.downloadProgress = Math.trunc(progress.percent);
            console.log(progress.percent);
        });
        this.downloadProgress = await window.preload.isUpdateDownloaded() ? 100 : 0;
        window.preload.on(UPDATE_DOWNLOADED, () => {
            this.isDownloading = false;
            this.downloadError = false;
            this.downloadProgress = 100;
        });
        window.preload.on(UPDATE_ERROR, () => {
            this.isDownloading = false;
            this.downloadProgress = 0;
            this.downloadError = true;
        });
    },

    methods: {
        loadServers() {
            this.isLoadingServers = true;
            useApi().get('/v1/servers/list').then(data => {
                this.serverList = data;
            }).catch(error => {
                console.error(error);
            }).finally(() => {
                this.isLoadingServers = false;
            });
        },
        zoomController(type) {
            if (type) {
                (this.zoom + scaleModifier > 3) ? this.zoom = 3 : this.zoom += scaleModifier;
            } else {
                (this.zoom - scaleModifier < 1) ? this.zoom = 1 : this.zoom -= scaleModifier;
            }
        },
        installUpdate() {
            if (!this.showInstallUpdate && this.currentServer.status !== Status.NOT_RUNNING) {
                this.showInstallUpdate = true;
            } else {
                window.preload.quitAndInstallUpdate();
            }
        }
    }
};
</script>

<style>
.zoom-container {
    right: 0;
    @apply absolute z-20 flex px-8 bg-gray-900/95 rounded-bl shadow-4;
}

.zoom {
    height: 1.125rem; /* 18px */
    cursor: pointer;
}

.zoom:hover {
    @apply bg-gray-700;
}

.zoom:first-child {
    @apply p-8;
}

.zoom:last-child {
    @apply p-8;
}
</style>
