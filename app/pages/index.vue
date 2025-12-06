<script setup lang="ts">
import StatusSignal from '@/components/StatusSignal.vue'
import StatusBattery from '@/components/StatusBattery.vue'
import StatusBarEditor from '@/components/StatusBarEditor.vue'
import StatusWifi from '@/components/StatusWifi.vue'

const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const timeText = computed(() => {
  const d = now.value ?? new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
})
const dateText = computed(() => {
  const d = now.value ?? new Date()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${month}月${day}日 週${week}`
})

const battery = ref(85)
const carrier = ref('中国移动')
const signalLevel = ref(3)
const wifiLevel = ref(3)
const gradientPresets = {
  indigo: 'bg-gradient-to-br from-slate-800 via-indigo-800 to-purple-700',
  aurora: 'bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600',
  sunset: 'bg-gradient-to-br from-orange-500 via-pink-500 to-rose-600',
  ocean: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
  forest: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-800',
} as const
type GradientKey = keyof typeof gradientPresets
const bgPreset = ref<GradientKey>('indigo')
const useCustomBg = ref(false)
const bgFrom = ref('#3b82f6')
const bgVia = ref('#8b5cf6')
const bgTo = ref('#ec4899')
const bgDeg = ref(135)
const bgClass = computed(() => (useCustomBg.value ? '' : gradientPresets[bgPreset.value]))
const bgStyle = computed(() => (useCustomBg.value
  ? { backgroundImage: `linear-gradient(${bgDeg.value}deg, ${bgFrom.value}, ${bgVia.value}, ${bgTo.value})` }
  : {}))
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto max-w-[1200px]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex justify-center">
          <div class="relative">
            <div class="relative w-[360px] h-[720px] rounded-[48px] bg-black p-4 shadow-2xl">
              <div class="absolute left-[-3px] top-[60px] w-[3px] h-[22px] bg-black rounded-l-md" />
              <div class="absolute left-[-3px] top-[100px] w-[3px] h-[40px] bg-black rounded-l-md" />
              <div class="absolute left-[-3px] top-[160px] w-[3px] h-[40px] bg-black rounded-l-md" />
              <div class="absolute right-[-3px] top-[140px] w-[3px] h-[60px] bg-black rounded-r-md" />

              <div
                class="w-full h-full rounded-[40px] relative overflow-hidden"
                :class="bgClass"
                :style="bgStyle"
              >
                <div class="absolute top-0 left-0 right-0 h-12 text-white flex items-center justify-between px-4 text-[11px]">
                  <span>{{ carrier }}</span>
                  <div class="flex items-center gap-2">
                    <StatusSignal :level="signalLevel" />
                    <StatusWifi :level="wifiLevel" />
                    <StatusBattery :percent="battery" />
                  </div>
                </div>

                <div class="mt-16 text-center text-white select-none">
                  <div class="text-sm">
                    {{ dateText }}
                  </div>
                  <div class="text-6xl font-semibold tracking-tight mt-2">
                    {{ timeText }}
                  </div>
                </div>

                <div class="absolute bottom-8 left-6">
                  <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Icon
                      name="ri:flashlight-line"
                      class="w-6 h-6 text-white"
                    />
                  </div>
                </div>
                <div class="absolute bottom-8 right-6">
                  <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Icon
                      name="ri:camera-line"
                      class="w-6 h-6 text-white"
                    />
                  </div>
                </div>

                <div class="absolute bottom-24 left-1/2 -translate-x-1/2">
                  <div class="px-6 py-2 rounded-full bg-white/80 text-black text-sm backdrop-blur-sm shadow-md transition-transform duration-200 hover:scale-110 hover:-translate-y-0.5">
                    上滑解锁
                  </div>
                </div>

                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/70" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="text-xl font-semibold mb-4">
            编辑器
          </div>
          <StatusBarEditor
            v-model:carrier="carrier"
            v-model:signal-level="signalLevel"
            v-model:wifi-level="wifiLevel"
            v-model:battery="battery"
            v-model:bg-preset="bgPreset"
            v-model:use-custom-bg="useCustomBg"
            v-model:bg-from="bgFrom"
            v-model:bg-via="bgVia"
            v-model:bg-to="bgTo"
            v-model:bg-deg="bgDeg"
          />
        </div>
      </div>
    </div>
  </div>
</template>
