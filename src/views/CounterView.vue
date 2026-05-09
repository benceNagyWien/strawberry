<template>
  <!-- Strawberry Rain overlay -->
  <template v-if="isZero && data">
    <span
      v-for="s in strawberries"
      :key="s.id"
      class="strawberry-fall"
      :style="{
        left: s.left + '%',
        fontSize: s.fontSize,
        animationDelay: s.delay,
        animationDuration: s.duration,
      }"
    >🍓</span>
  </template>

  <div
    class="relative min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/50 to-slate-950 flex flex-col items-center overflow-hidden"
  >
    <!-- Back link (subtle) -->
    <router-link
      to="/"
      class="fixed top-4 right-4 z-20 text-white/20 hover:text-white/50 text-xl transition-colors select-none"
      title="Zur Anmeldung"
    >←</router-link>

    <!-- No data state -->
    <div v-if="!data" class="flex flex-col items-center justify-center min-h-screen gap-4">
      <div class="text-6xl">🍓</div>
      <p class="text-white/60 text-lg">Keine Einstellungen gefunden.</p>
      <router-link
        to="/"
        class="mt-2 text-rose-400 hover:text-rose-300 underline underline-offset-4 transition-colors text-sm"
      >
        Zur Anmeldung
      </router-link>
    </div>

    <template v-else>
      <!-- Flag -->
      <div class="pt-10 pb-8 text-center z-10">
        <span class="text-7xl md:text-8xl lg:text-9xl select-none drop-shadow-2xl animate-pulse-slow inline-block">
          {{ data.flagEmoji || '🏳️' }}
        </span>
      </div>

      <!-- Countdown -->
      <div class="flex items-end gap-1 sm:gap-3 md:gap-5 px-3 z-10 flex-wrap justify-center">
        <template v-for="(unit, i) in countdownUnits" :key="unit.label">
          <div class="flex flex-col items-center">
            <!-- Glow backdrop -->
            <div class="relative">
              <div class="absolute inset-0 rounded-2xl bg-rose-500/25 blur-2xl scale-110"></div>
              <div
                class="relative bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl
                       px-3 py-3 sm:px-6 sm:py-5 md:px-8 md:py-7 shadow-2xl shadow-black/40"
              >
                <span
                  class="block text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white
                         tabular-nums leading-none tracking-tight"
                >
                  {{ String(unit.value).padStart(2, '0') }}
                </span>
              </div>
            </div>
            <span
              class="text-rose-300/80 text-[9px] sm:text-xs uppercase tracking-widest mt-2 sm:mt-3 font-semibold"
            >
              {{ unit.label }}
            </span>
          </div>

          <!-- Colon separator -->
          <span
            v-if="i < countdownUnits.length - 1"
            class="text-rose-500/50 text-2xl sm:text-4xl md:text-6xl font-black mb-5 sm:mb-8 md:mb-12 select-none"
          >:</span>
        </template>
      </div>

      <!-- Celebration -->
      <div v-if="isZero" class="mt-10 z-10 text-center px-4 fade-in">
        <p class="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
          🎉 Ziel erreicht! 🎉
        </p>
        <p class="text-rose-300 mt-3 text-sm sm:text-lg">Der große Moment ist da!</p>
      </div>

      <!-- Progress bar (subtle, below countdown) -->
      <div class="mt-10 w-full max-w-md px-8 z-10" v-if="!isZero">
        <div class="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-1000"
            :style="{ width: `${progress * 100}%` }"
          ></div>
        </div>
        <p class="text-center text-white/20 text-xs mt-2 tabular-nums">
          {{ Math.round(progress * 100) }}% der Zeit verstrichen
        </p>
      </div>

      <!-- Images: fixed to bottom corners, move inward with progress -->
      <img
        v-if="data.leftPersonImage"
        :src="data.leftPersonImage"
        class="fixed bottom-0 left-0 object-cover object-top rounded-tr-3xl shadow-2xl shadow-black/60"
        :style="leftImgStyle"
        alt="Linke Person"
      />
      <img
        v-if="data.rightPersonImage"
        :src="data.rightPersonImage"
        class="fixed bottom-0 right-0 object-cover object-top rounded-tl-3xl shadow-2xl shadow-black/60"
        :style="rightImgStyle"
        alt="Rechte Person"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { loadData, type AppData } from '../storage'

interface Strawberry {
  id: number
  left: number
  fontSize: string
  delay: string
  duration: string
}

const data = ref<AppData | null>(null)
const now = ref(Date.now())
const windowWidth = ref(window.innerWidth)
const strawberries = ref<Strawberry[]>([])

const remaining = computed(() => {
  if (!data.value?.targetDate) return 0
  return Math.max(0, new Date(data.value.targetDate).getTime() - now.value)
})

const isZero = computed(() => data.value !== null && remaining.value === 0)

const days = computed(() => Math.floor(remaining.value / 86400000))
const hours = computed(() => Math.floor((remaining.value % 86400000) / 3600000))
const minutes = computed(() => Math.floor((remaining.value % 3600000) / 60000))
const seconds = computed(() => Math.floor((remaining.value % 60000) / 1000))

const countdownUnits = computed(() => [
  { value: days.value, label: 'Tage' },
  { value: hours.value, label: 'Stunden' },
  { value: minutes.value, label: 'Minuten' },
  { value: seconds.value, label: 'Sekunden' },
])

const progress = computed(() => {
  if (!data.value?.creationDate || !data.value?.targetDate) return 0
  const start = new Date(data.value.creationDate).getTime()
  const end = new Date(data.value.targetDate).getTime()
  if (end <= start) return 0
  return Math.min(1, Math.max(0, (now.value - start) / (end - start)))
})

const imgW = computed(() => (windowWidth.value < 640 ? 110 : windowWidth.value < 1024 ? 180 : 220))

const imgTranslate = computed(() => {
  const maxTranslate = windowWidth.value / 2 - imgW.value / 2
  return progress.value * maxTranslate
})

const imgH = computed(() => (windowWidth.value < 640 ? '210px' : windowWidth.value < 1024 ? '340px' : '420px'))

const leftImgStyle = computed(() => ({
  width: `${imgW.value}px`,
  height: imgH.value,
  transform: `translateX(${imgTranslate.value}px)`,
  transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}))

const rightImgStyle = computed(() => ({
  width: `${imgW.value}px`,
  height: imgH.value,
  transform: `translateX(${-imgTranslate.value}px)`,
  transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}))

function generateStrawberries() {
  if (strawberries.value.length > 0) return
  strawberries.value = Array.from({ length: 42 }, (_, i) => ({
    id: i,
    left: Math.random() * 96,
    fontSize: `${(1.4 + Math.random() * 2.2).toFixed(1)}rem`,
    delay: `${(Math.random() * 5).toFixed(2)}s`,
    duration: `${(2.5 + Math.random() * 4).toFixed(2)}s`,
  }))
}

watch(isZero, (val) => {
  if (val) generateStrawberries()
})

let timerInterval: ReturnType<typeof setInterval> | undefined
const handleResize = () => { windowWidth.value = window.innerWidth }

onMounted(() => {
  data.value = loadData()
  if (data.value && remaining.value === 0) generateStrawberries()
  timerInterval = setInterval(() => { now.value = Date.now() }, 1000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  window.removeEventListener('resize', handleResize)
})
</script>
