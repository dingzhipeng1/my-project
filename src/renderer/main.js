import Vue from 'vue'

import App from './App'
import {ipcRenderer} from 'electron'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$ipc = ipcRenderer
Vue.prototype.$axios =function (option) {
    option.callbackName="axiosgetdata"+new Date().getTime()+Math.ceil(Math.random()*1000000000)
    Vue.prototype.$ipc.send('axiosgetdata', option)
    var pro = new Promise((r1, r2) => {
        Vue.prototype.$ipc.once(option.callbackName, (e, a) => {
            r1(JSON.parse(a))
        })
    })
    return pro;
}
Vue.prototype.$axiosStr =function (option) {
    option.callbackName="axiosgetdata"+new Date().getTime()+Math.ceil(Math.random()*1000000000)
    Vue.prototype.$ipc.send('axiosgetdata', option)
    var pro = new Promise((r1, r2) => {
        Vue.prototype.$ipc.once(option.callbackName, (e, a) => {
            r1(a)
        })
    })
    return pro;
}

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
    components: {App},
    template: '<App/>'
}).$mount('#app')
