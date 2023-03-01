import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/sass/index.scss' // 全局样式
import components from '@/components/global/index' // 全局自定义组件
import Directive from '@/directive' // 自定义指令
import 'default-passive-events'


const app = createApp(App)

app.use(router)
  .use(store)
  .use(components)
  .use(Directive)
  .mount('#app')
