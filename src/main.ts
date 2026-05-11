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
    { path: '/editor', component: EditorView, meta: { requiresRole: 'editor' } },
    { path: '/counter', component: CounterView, meta: { requiresRole: 'user' } },
  ],
})

router.beforeEach((to) => {
  const required = to.meta.requiresRole as string | undefined
  if (!required) return true
  const role = sessionStorage.getItem('auth_role')
  if (required === 'editor' && role !== 'editor') return '/'
  if (required === 'user' && role !== 'editor' && role !== 'user') return '/'
  return true
})

const app = createApp(App)
app.use(router)
app.mount('#app')
