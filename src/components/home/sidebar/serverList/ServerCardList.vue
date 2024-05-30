<template>
    <div class="sidebar-card h-full w-full relative overflow-hidden">
        <div class="sidebar-card-inner p-8 h-full overflow-y-auto" @scroll="updateShadows">
            <div v-if="Object.keys(list.primary).length === 0 && Object.keys(list.secondary).length === 0" class="text-center p-8">
                <div class="text-red-200">Couldn't load DicyVPN servers</div>
                <br>
                <Button theme="dark" color="blue" @click="reload"><span>Try again</span></Button>
            </div>
            <template v-else>
                <!-- Free section -->
                <div v-if="isFreePlan" class="flex flex-col">
                    <p class="m-8 font-light">Free Servers</p>
                    <FreeServers :servers-by-country="list.primary" />
                    <p class="mt-16 mx-8 mb-0 font-light">Premium Servers</p>
                    <p class="ml-8 text-small text-gray-200">Upgrade your plan to access Premium servers</p>
                    <Button class="mx-8 my-16" theme="dark" color="blue"><span>Upgrade</span></Button>
                </div>
                <!-- Normal section -->
                <div class="flex flex-col gap-8" :class="{blocked: isFreePlan}">
                    <p class="ml-8 mt-8 text-small font-light">Server Consigliati</p>
                    <PrimaryServers :list="list" />
                    <div>
                        <p class="ml-8 text-small font-light">Altri Server</p>
                        <div class="mt-8 bg-gray-600 w-full h-[1px]"></div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <Dropdown :list="list" />
                    </div>
                </div>
            </template>
        </div>
        <div class="scroll-shadow-top absolute" :class="{'top-shadow': showTopShadow}"></div>
        <div class="scroll-shadow-bottom absolute" :class="{'bottom-shadow': showBottomShadow}"></div>
    </div>
</template>
<script>
import Dropdown from '@/components/home/sidebar/serverList/secondary/SecondaryServers.vue';
import PrimaryServers from '@/components/home/sidebar/serverList/primary/PrimaryServers.vue';
import Button from '@/components/icons/Button.vue';
import FreeServers from '@/components/home/sidebar/serverList/FreeServers.vue';

export default {
    components: {FreeServers, Button, PrimaryServers, Dropdown},
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
            showBottomShadow: true,
            isFreePlan: false
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

.blocked {
    @apply pointer-events-none opacity-30;
}
</style>
