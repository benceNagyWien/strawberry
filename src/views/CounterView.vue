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
      <!-- Heading -->
      <div class="pt-10 pb-4 text-center z-10 px-4">
        <p class="text-white/70 text-base sm:text-lg md:text-xl font-semibold tracking-wide uppercase">
          KB und SM Wiedersehen in…
        </p>
      </div>

      <!-- Countdown: only days -->
      <div class="flex flex-col items-center z-10">
        <div class="relative">
          <div class="absolute inset-0 rounded-2xl bg-rose-500/25 blur-2xl scale-110"></div>
          <div
            class="relative bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl
                   px-10 py-6 sm:px-20 sm:py-10 md:px-28 md:py-14 shadow-2xl shadow-black/40"
          >
            <span
              class="block text-[7rem] sm:text-[11rem] md:text-[15rem] font-black text-white
                     tabular-nums leading-none tracking-tight"
            >
              {{ days }}
            </span>
          </div>
        </div>
        <span class="text-rose-300/80 text-xs sm:text-sm uppercase tracking-widest mt-3 font-semibold">
          {{ days === 1 ? 'Tag' : 'Tage' }}
        </span>
      </div>

      <!-- Celebration -->
      <div v-if="isZero" class="mt-10 z-10 text-center px-4 fade-in">
        <p class="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
          🎉 Ziel erreicht! 🎉
        </p>
        <p class="text-rose-300 mt-3 text-sm sm:text-lg">Der große Moment ist da!</p>
      </div>

      <!-- Progress bar -->
      <div class="mt-10 w-full max-w-md px-8 z-10" v-if="!isZero">
        <div class="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-1000"
            :style="{ width: `${progress * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Two emojis: fixed at bottom, move closer as days approach zero -->
      <span
        v-if="data.leftEmoji"
        class="absolute top-[75%] md:top-[68%] left-0 select-none leading-none z-20"
        :style="leftEmojiStyle"
      >{{ data.leftEmoji }}</span>

      <span
        v-if="data.rightEmoji"
        class="absolute top-[75%] md:top-[68%] right-0 select-none leading-none z-20"
        :style="rightEmojiStyle"
      >{{ data.rightEmoji }}</span>

      <!-- Flag: centered between the two emojis, behind the emojis -->
      <span
        v-if="data.flagEmoji"
        class="absolute top-[85%] md:top-[80%] left-1/2 select-none leading-none z-10"
        :style="{ fontSize: emojiFontSize, transform: 'translateX(-50%) translateY(-50%)' }"
      >{{ data.flagEmoji }}</span>
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

const progress = computed(() => {
  if (!data.value?.creationDate || !data.value?.targetDate) return 0
  const start = new Date(data.value.creationDate).getTime()
  const end = new Date(data.value.targetDate).getTime()
  if (end <= start) return 0
  return Math.min(1, Math.max(0, (now.value - start) / (end - start)))
})

const emojiFontSize = computed(() =>
  windowWidth.value < 640 ? '5rem' : windowWidth.value < 1024 ? '7rem' : '9rem'
)

const emojiTranslate = computed(() => {
  const d = Math.min(days.value, 30)
  const ratio = d / 30
  const emojiPx = windowWidth.value < 640 ? 80 : windowWidth.value < 1024 ? 112 : 144
  const maxTranslate = Math.max(0, windowWidth.value / 2 - emojiPx / 2 - 16)
  return (1 - ratio) * maxTranslate
})

const leftEmojiStyle = computed(() => ({
  fontSize: emojiFontSize.value,
  transform: `translateX(${emojiTranslate.value}px) translateY(-50%)`,
  transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}))

const rightEmojiStyle = computed(() => ({
  fontSize: emojiFontSize.value,
  transform: `translateX(${-emojiTranslate.value}px) translateY(-50%)`,
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

onMounted(async () => {
  data.value = await loadData()
  if (data.value && remaining.value === 0) generateStrawberries()
  timerInterval = setInterval(() => { now.value = Date.now() }, 1000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  window.removeEventListener('resize', handleResize)
})
</script>
