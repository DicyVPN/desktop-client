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
    faCheckCircle,
    faTrash
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
    faTrash
)


import './assets/main.css'

const pinia = createPinia()
watch(pinia.state, (state) => {
    if(state.currentServer){
        localStorage.setItem('currentServer', JSON.stringify(state.currentServer))
    }
}, {deep : true});

const app = createApp(App)

app.use(router)
app.use(pinia)


app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')

