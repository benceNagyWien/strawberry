<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4 md:p-8">
    <!-- Header -->
    <div class="max-w-2xl mx-auto mb-6 flex items-center justify-between">
      <router-link
        to="/"
        class="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors"
      >
        <ArrowLeftIcon :size="16" />
        Abmelden
      </router-link>
      <h1 class="text-lg font-bold text-gray-800 flex items-center gap-2">
        <SettingsIcon :size="18" class="text-rose-500" />
        Editor
      </h1>
    </div>

    <div class="max-w-2xl mx-auto space-y-5">
      <!-- Target Date -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          <CalendarIcon :size="15" class="inline mr-1.5 -mt-0.5 text-rose-500" />
          Zieltermin
        </label>
        <input
          v-model="targetDate"
          type="datetime-local"
          class="w-full px-4 py-3 border-2 border-gray-200 focus:border-rose-400 rounded-xl outline-none transition-all text-gray-800 bg-white"
        />
      </div>

      <!-- Flag Emoji Dropdown -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          <FlagIcon :size="15" class="inline mr-1.5 -mt-0.5 text-rose-500" />
          Flagge
        </label>
        <div class="flex items-center gap-4">
          <div class="text-5xl select-none w-16 text-center shrink-0">{{ flagEmoji || '🏳️' }}</div>
          <select
            v-model="flagEmoji"
            class="flex-1 px-4 py-3 border-2 border-gray-200 focus:border-rose-400 rounded-xl outline-none transition-all text-gray-800 bg-white"
          >
            <option v-for="f in flagEmojis" :key="f.emoji" :value="f.emoji">
              {{ f.emoji }} {{ f.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Person Emojis -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Left Emoji -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Linkes Emoji
          </label>
          <div class="flex items-center gap-4">
            <div class="text-5xl select-none w-16 text-center shrink-0">{{ leftEmoji || '👦' }}</div>
            <select
              v-model="leftEmoji"
              class="flex-1 px-4 py-3 border-2 border-gray-200 focus:border-rose-400 rounded-xl outline-none transition-all text-gray-800 bg-white"
            >
              <option v-for="e in personEmojis" :key="e.emoji" :value="e.emoji">
                {{ e.emoji }} {{ e.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Right Emoji -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Rechtes Emoji
          </label>
          <div class="flex items-center gap-4">
            <div class="text-5xl select-none w-16 text-center shrink-0">{{ rightEmoji || '👧' }}</div>
            <select
              v-model="rightEmoji"
              class="flex-1 px-4 py-3 border-2 border-gray-200 focus:border-rose-400 rounded-xl outline-none transition-all text-gray-800 bg-white"
            >
              <option v-for="e in personEmojis" :key="e.emoji" :value="e.emoji">
                {{ e.emoji }} {{ e.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="pb-10">
        <button
          @click="handleSave"
          class="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 flex items-center justify-center gap-2 text-base"
        >
          <CheckIcon v-if="saved" :size="18" />
          <SaveIcon v-else :size="18" />
          {{ saved ? 'Gespeichert!' : 'Einstellungen speichern' }}
        </button>
        <p v-if="saved" class="text-center text-green-600 text-sm mt-3 fade-in">
          ✓ Alle Einstellungen wurden erfolgreich gespeichert.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  FlagIcon,
  SaveIcon,
  SettingsIcon,
} from 'lucide-vue-next'
import { loadData, saveData } from '../storage'
import { flagEmojis, personEmojis } from '../emojis'

const targetDate = ref('')
const flagEmoji = ref('')
const leftEmoji = ref('')
const rightEmoji = ref('')
const creationDate = ref('')
const saved = ref(false)

onMounted(() => {
  const data = loadData()
  if (data) {
    targetDate.value = data.targetDate ? toLocalInput(data.targetDate) : ''
    flagEmoji.value = data.flagEmoji || '🇭🇺'
    leftEmoji.value = data.leftEmoji || '👦'
    rightEmoji.value = data.rightEmoji || '👧'
    creationDate.value = data.creationDate || new Date().toISOString()
  }
})

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function handleSave() {
  saveData({
    targetDate: targetDate.value ? new Date(targetDate.value).toISOString() : '',
    creationDate: creationDate.value || new Date().toISOString(),
    flagEmoji: flagEmoji.value,
    leftEmoji: leftEmoji.value,
    rightEmoji: rightEmoji.value,
  })
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>
