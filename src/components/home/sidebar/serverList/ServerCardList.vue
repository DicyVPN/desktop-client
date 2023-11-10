<template>
    <div class="sidebar-card h-full w-full relative overflow-hidden">
        <div class="sidebar-card-inner p-8 h-full flex flex-col gap-8 overflow-y-auto" @scroll="updateShadows">
            <div v-if="list.primary.length === 0 && list.secondary.length === 0" class="text-center p-8">
                <div class="text-red-200">Couldn't load DicyVPN servers</div>
                <br>
                <Button theme="dark" color="blue" @click="reload"><span>Try again</span></Button>
            </div>
            <template v-else>
                <p class="ml-8 mt-8 text-small font-light">Server Consigliati</p>
                <PrimaryServers :list="list"/>
                <div>
                    <p class="ml-8 text-small font-light">Altri Server</p>
                    <div class="mt-8 bg-gray-600 w-full h-[1px]"></div>
                </div>
                <div class="flex flex-col gap-2">
                    <Dropdown :list="list"/>
                </div>
            </template>
        </div>
        <div class="scroll-shadow-top absolute" :class="{'top-shadow': showTopShadow}"></div>
        <div class="scroll-shadow-bottom absolute" :class="{'bottom-shadow': showBottomShadow}"></div>
    </div>
</template>
<script>
import Dropdown from '@/components/home/sidebar/serverList/secondary/SecondaryServer.vue';
import PrimaryServers from '@/components/home/sidebar/serverList/primary/PrimaryServer.vue';
import Button from '@/components/icons/Button.vue';

export default {
    components: {Button, PrimaryServers, Dropdown},
    props: {
        list: {
            type: Object,
            required: true
        },
        reload: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            showTopShadow: false,
            showBottomShadow: true
        };
    },
    methods: {
        updateShadows({target: {scrollTop, clientHeight, scrollHeight}}) {
            this.showTopShadow = scrollTop > 12;
            this.showBottomShadow = scrollTop + clientHeight < scrollHeight - 12;
        }
    }
};
</script>

<style scoped>
.sidebar-card-inner::-webkit-scrollbar {
    width: 8px;
}

.sidebar-card-inner::-webkit-scrollbar-track {
    border-bottom-right-radius: theme('borderRadius.DEFAULT');
    border-top-right-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card-inner::-webkit-scrollbar-thumb {
    background: theme('colors.gray.900');
    border-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card-inner::-webkit-scrollbar-thumb:hover {
    background: black;
}


@property --shadow-color {
    syntax: '<color>';
    initial-value: rgb(0 0 0 / 0);
    inherits: false;
}

.scroll-shadow-top, .scroll-shadow-bottom {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    --shadow-color: rgb(0 0 0 / 0);
    background-image: linear-gradient(var(--shadow-direction), var(--shadow-color), rgb(0 0 0 / 0) 3.6rem, rgb(0 0 0 / 0));
    transition: --shadow-color 200ms ease-in-out;
}

.scroll-shadow-top {
    --shadow-direction: to bottom;
}

.scroll-shadow-bottom {
    --shadow-direction: to top;
}

.top-shadow {
    --shadow-color: hsl(222, 10%, 5%);
}

.bottom-shadow {
    --shadow-color: hsl(222, 10%, 5%);
}
</style>
