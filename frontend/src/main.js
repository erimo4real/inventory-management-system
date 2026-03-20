import { createApp } from 'vue'
import App from './App.vue'
import router from './shared/router/index.js'
import store from './shared/store/index.js'
import './shared/styles/main.css'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
