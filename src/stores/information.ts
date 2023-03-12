import {defineStore} from 'pinia'


export const useInformationStore = defineStore('information', {
    state: () => {
        return ({
            ip: '000.000.00.000'
        })
    },
})