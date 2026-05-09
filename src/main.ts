import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import EditorView from './views/EditorView.vue'
import CounterView from './views/CounterView.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    { path: '/editor', component: EditorView },
    { path: '/counter', component: CounterView },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
