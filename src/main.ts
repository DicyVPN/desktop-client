import {createApp, watch} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'


import {
    faEllipsisVertical,
    faChevronDown,
    faRightFromBracket,
    faGear,
    faRectangleXmark,
    faEarthAmericas,
    faUser,
    faEye,
    faEyeSlash,
    faCircleNotch,
    faPlus,
    faMinus,
    faCircleXmark,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faEllipsisVertical,
    faChevronDown,
    faRightFromBracket,
    faGear,
    faRectangleXmark,
    faEarthAmericas,
    faUser,
    faEye,
    faEyeSlash,
    faCircleNotch,
    faPlus,
    faMinus,
    faCircleXmark,
    faCheckCircle,
)


import './assets/main.css'

const pinia = createPinia()




const app = createApp(App)

app.use(router)
app.use(pinia)


app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')

