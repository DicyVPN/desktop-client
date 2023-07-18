<template>
    <div class="message-bg bg-opacity-50" :class="colorClass">
        <p class="ml-auto">{{ text }}</p>
        <p class="ml-auto message-x" @click="message.show = false ">&times;</p>
    </div>
</template>
<script>
import {message} from '@/global';

export default {
    data() {
        return {
            message
        };
    },
    props: {
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    computed: {
        colorClass() {
            switch (this.type) {
                case 'success':
                    return 'bg-green-500';
                case 'error':
                    return 'bg-red-500';
                case 'info':
                    return 'bg-blue-500';
            }
        }
    }
};
</script>
<style>
.message-bg {
    @apply fixed min-w-256 rounded shadow-4-lg p-8 justify-center flex inset-x-0 bottom-0
}

.message-x {
    cursor: pointer;
}
</style>
