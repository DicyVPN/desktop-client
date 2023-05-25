<template>
  <div class="button" :class="{[color]: true, [theme]: true, [size]: true, disabled}">
    <slot/>
  </div>
</template>

<script lang="ts">
type Theme = 'dark' | 'light';
type Color = 'blue' | 'red' | 'green';
type Size = 'normal' | 'big';
export default {
  props: {
    theme: { // can be dark or light
      type: String as () => Theme,
      default: 'dark' as Theme
    },
    color: {
      type: String as () => Color
    },
    size: {
      type: String as () => Size,
      default: 'normal' as Size
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.button {
  @apply flex items-center justify-center rounded font-semibold text-small transition-colors duration-100 ease-in-out;
  box-shadow: 0 2px 0 0 hsl(0 0% 100% / 25%) inset, 0 2px 3px 0 hsl(0 0% 0% / 20%);

  &.big {
    @apply font-medium text-medium;
  }

  &.disabled {
    @apply opacity-50 cursor-default;
  }

  &:not(.disabled) {
    cursor: pointer;
  }
}

:slotted(:not(.override-py)) {
  @apply py-8;
}

:slotted(:not(.override-px)) {
  @apply px-16;
}

:slotted(:not(.override-width)) {
  @apply w-full text-center;
}

.button.dark {
  @apply text-white;
}

.button.blue {
  @apply bg-blue-500;

  &:hover:not(.disabled) {
    @apply bg-blue-600;
  }

  &.light {
    @apply bg-blue-100 text-blue-600;
  }

  &.light:hover:not(.disabled) {
    @apply bg-blue-200 text-blue-700;
  }
}

.button.red {
  @apply bg-red-500;

  &:hover:not(.disabled) {
    @apply bg-red-600;
  }

  &.light {
    @apply bg-red-100 text-red-600;
  }

  &.light:hover:not(.disabled) {
    filter: brightness(0.9);
  }
}

.button.green {
  @apply bg-green-500;

  &:hover:not(.disabled) {
    @apply bg-green-600;
  }

  &.light {
    @apply bg-green-100 text-green-600;
  }

  &.light:hover:not(.disabled) {
    filter: brightness(0.9);
  }
}
</style>
