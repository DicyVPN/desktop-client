import {defineStore} from 'pinia'


export const useInformationStore = defineStore('information', {
    state: () => {
        return ({
            ip: '...'
        })
    },
})
