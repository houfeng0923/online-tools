import { createApp } from 'vue'
import App from './App.vue'
import * as http from './utils/http';

import './index.css'

const app = createApp(App)

app.config.globalProperties.$http = http

app.mount('#app')
