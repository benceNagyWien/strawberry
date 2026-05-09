<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-7xl mb-4 select-none">🍓</div>
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Willkommen</h1>
        <p class="text-gray-500 mt-2 text-sm">Bitte gib dein Passwort ein, um fortzufahren</p>
      </div>

      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-rose-100 p-8">
        <form @submit.prevent="handleLogin">
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <LockIcon :size="14" class="inline mr-1 -mt-0.5" />
              Passwort
            </label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 text-gray-800 bg-white"
              :class="error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-rose-400'"
              placeholder="••••••••"
              @input="error = ''"
            />
            <p v-if="error" class="text-red-500 text-sm mt-2 flex items-center gap-1 fade-in">
              <XCircleIcon :size="14" />
              {{ error }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-200"
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LockIcon, XCircleIcon } from 'lucide-vue-next'

const router = useRouter()
const password = ref('')
const error = ref('')

function handleLogin() {
  if (password.value === 'editor123') {
    router.push('/editor')
  } else if (password.value === 'user123') {
    router.push('/counter')
  } else {
    error.value = 'Falsches Passwort. Bitte versuche es erneut.'
    password.value = ''
  }
}
</script>
