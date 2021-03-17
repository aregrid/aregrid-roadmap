import { createApp } from 'vue'
//https://element-plus.gitee.io/#/zh-CN/component/quickstart
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import App from './App.vue'
import './index.css'

window['moment-range'].extendMoment(moment);

var app = createApp(App);
app.use(ElementPlus)

app.mount('#app')
