<template>
    <dialog ref="dialog" class="rounded shadow-4 p-24 select-none">
        <h3 class="font-semibold mb-4">{{ title }}</h3>
        <div>
            <slot></slot>
        </div>
        <div class="flex gap-12 mt-12 justify-end">
            <button v-if="secondaryLabel" class="font-semibold text-gray-500 hover:text-gray-700" @click="onSecondaryAction">
                {{ secondaryLabel }}
            </button>
            <Button v-if="actionLabel" size="normal" color="blue" theme="dark" @click="onAction"><span>{{ actionLabel }}</span></Button>
        </div>
    </dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Button from '@/components/icons/Button.vue';

export default defineComponent({
    components: {Button},
    props: {
        title: {
            type: String,
            required: true
        },
        secondaryLabel: {
            type: String,
            default: null
        },
        actionLabel: {
            type: String,
            default: null
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    emits: ['secondary', 'action'],
    methods: {
        onSecondaryAction() {
            this.$emit('secondary');
        },
        onAction() {
            this.$emit('action');
        }
    },
    watch: {
        show(value) {
            if (value) {
                this.$refs.dialog.showModal();
            } else {
                this.$refs.dialog.close();
            }
        }
    }
});
</script>
