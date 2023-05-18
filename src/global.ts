import { reactive } from "vue";


export let message = reactive({
    text: '',
    type: 'info',
    show: false
})


export function throwError(text: string){
    message.text = text
    message.type = "error"
    message.show = true

    setTimeout(() => {
        message.show = false
    }, 5000)
}

export function throwSuccess(text: string){
    message.text = text
    message.type = "success"
    message.show = true

    setTimeout(() => {
        message.show = false
    }, 3000)
}


export let connectionTime : any = reactive({
    time: 0
})




