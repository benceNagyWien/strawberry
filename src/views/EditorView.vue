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

      <!-- Flag Emoji -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          <FlagIcon :size="15" class="inline mr-1.5 -mt-0.5 text-rose-500" />
          Flagge (Emoji)
        </label>
        <div class="flex items-center gap-4">
          <input
            v-model="flagEmoji"
            type="text"
            class="flex-1 px-4 py-3 border-2 border-gray-200 focus:border-rose-400 rounded-xl outline-none transition-all text-gray-800 bg-white text-2xl"
            placeholder="🇭🇺"
            maxlength="8"
          />
          <div class="text-5xl select-none w-16 text-center">
            {{ flagEmoji || '🏳️' }}
          </div>
        </div>
      </div>

      <!-- Image Uploads -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Left Person -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            <UserIcon :size="15" class="inline mr-1.5 -mt-0.5 text-rose-500" />
            Linke Person
          </label>
          <div
            class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer hover:border-rose-400 transition-colors group bg-gray-50"
            @click="leftInput?.click()"
          >
            <img
              v-if="leftPersonImage"
              :src="leftPersonImage"
              class="w-full h-full object-cover"
              alt="Linke Person"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-rose-400 transition-colors"
            >
              <UploadIcon :size="32" class="mb-2" />
              <span class="text-sm font-medium">Bild auswählen</span>
            </div>
            <div
              v-if="leftPersonImage"
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span class="text-white text-sm font-semibold">Ändern</span>
            </div>
          </div>
          <input
            ref="leftInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImage('left', $event)"
          />
        </div>

        <!-- Right Person -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md shadow-rose-100 p-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            <UserIcon :size="15" class="inline mr-1.5 -mt-0.5 text-rose-500" />
            Rechte Person
          </label>
          <div
            class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer hover:border-rose-400 transition-colors group bg-gray-50"
            @click="rightInput?.click()"
          >
            <img
              v-if="rightPersonImage"
              :src="rightPersonImage"
              class="w-full h-full object-cover"
              alt="Rechte Person"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-rose-400 transition-colors"
            >
              <UploadIcon :size="32" class="mb-2" />
              <span class="text-sm font-medium">Bild auswählen</span>
            </div>
            <div
              v-if="rightPersonImage"
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span class="text-white text-sm font-semibold">Ändern</span>
            </div>
          </div>
          <input
            ref="rightInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImage('right', $event)"
          />
        </div>
      </div>

      <!-- Save Button -->
      <div class="pb-10">
        <button
          @click="handleSave"
          :disabled="processing"
          class="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 active:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 flex items-center justify-center gap-2 text-base"
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
  UploadIcon,
  UserIcon,
} from 'lucide-vue-next'
import { loadData, saveData } from '../storage'

const targetDate = ref('')
const flagEmoji = ref('')
const leftPersonImage = ref('')
const rightPersonImage = ref('')
const leftInput = ref<HTMLInputElement | null>(null)
const rightInput = ref<HTMLInputElement | null>(null)
const processing = ref(false)
const saved = ref(false)

onMounted(() => {
  const data = loadData()
  if (data) {
    targetDate.value = data.targetDate ? toLocalInput(data.targetDate) : ''
    flagEmoji.value = data.flagEmoji
    leftPersonImage.value = data.leftPersonImage
    rightPersonImage.value = data.rightPersonImage
  }
})

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 900
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleImage(side: 'left' | 'right', event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  processing.value = true
  try {
    const base64 = await compressImage(file)
    if (side === 'left') leftPersonImage.value = base64
    else rightPersonImage.value = base64
  } finally {
    processing.value = false
  }
}

function handleSave() {
  saveData({
    targetDate: targetDate.value ? new Date(targetDate.value).toISOString() : '',
    creationDate: new Date().toISOString(),
    flagEmoji: flagEmoji.value,
    leftPersonImage: leftPersonImage.value,
    rightPersonImage: rightPersonImage.value,
  })
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>
