<template>
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="16" fill="#252B3A"/>
    <path
        d="M16 16C17.0609 16 18.0783 15.5786 18.8284 14.8284C19.5786 14.0783 20 13.0609 20 12C20 10.9391 19.5786 9.92172 18.8284 9.17157C18.0783 8.42143 17.0609 8 16 8C14.9391 8 13.9217 8.42143 13.1716 9.17157C12.4214 9.92172 12 10.9391 12 12C12 13.0609 12.4214 14.0783 13.1716 14.8284C13.9217 15.5786 14.9391 16 16 16ZM14.5719 17.5C11.4938 17.5 9 19.9937 9 23.0719C9 23.5844 9.41563 24 9.92813 24H22.0719C22.5844 24 23 23.5844 23 23.0719C23 19.9937 20.5063 17.5 17.4281 17.5H14.5719Z"
        fill="#D9E1F2"/>
  </svg>
</template>
<script>
export default {
  name: 'UserIcon'
}
</script>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>