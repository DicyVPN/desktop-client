import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {  faEllipsisVertical, faChevronDown, faRightFromBracket, faGear,  } from '@fortawesome/free-solid-svg-icons'

library.add(faEllipsisVertical, faChevronDown, faRightFromBracket, faGear)


import './assets/main.css'

const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
