<script setup lang="ts">
import StatusSignal from '@/components/StatusSignal.vue'
import StatusBattery from '@/components/StatusBattery.vue'
import StatusBarEditor from '@/components/StatusBarEditor.vue'
import StatusWifi from '@/components/StatusWifi.vue'
import MottoCard from '@/components/MottoCard.vue'
import SubwayLine from '@/components/SubwayLine.vue'
import { SOLID_PRESETS } from '@/constants'

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

type SolidKey = keyof typeof SOLID_PRESETS
const bgPreset = ref<SolidKey>('c1')
const useCustomBg = ref(false)
const bgFrom = ref('#0B3B9B')

const screenHex = computed(() => useCustomBg.value ? bgFrom.value : SOLID_PRESETS[bgPreset.value])
const screenBG = computed(() => ({ backgroundColor: screenHex.value }))

const useCustomCardBg = ref(false)
const cardBgFrom = ref('#ffffff')
const useCustomCardText = ref(false)
const cardTextFrom = ref('#1A41A1')
const useCustomCardExternalText = ref(false)
const cardExternalTextFrom = ref('#ffffff')

const screenCode = computed(() => screenHex.value.replace('#', '').toUpperCase())
const mappedCard = computed(() => {
  switch (screenCode.value) {
    case '0B3B9B':
      return { bg: '#fff', text: '#1A41A1', external: '#F1CE9A' }
    case '4B6548':
      return { bg: '#F3CB9D', text: '#4A5D47', external: '#fff' }
    case '6E0664':
      return { bg: '#fff', text: '#6D0360', external: '#fff' }
    case '233831':
      return { bg: '#F6DF39', text: '#243224', external: '#FADF39' }
    case 'A82239':
      return { bg: '#fff', text: '#A41F37', external: '#fff' }
    case '6E0663':
      return { bg: '#fff', text: '#6B035F', external: '#fff' }
    default:
      return { bg: '#fff', text: '#1A41A1', external: '#fff' }
  }
})

watch(mappedCard, (val) => {
  if (!useCustomCardBg.value) cardBgFrom.value = val.bg
  if (!useCustomCardText.value) cardTextFrom.value = val.text
  if (!useCustomCardExternalText.value) cardExternalTextFrom.value = val.external
}, { immediate: true })

const cardBackgroundColor = computed(() => useCustomCardBg.value ? cardBgFrom.value : mappedCard.value.bg)
const cardTextColor = computed(() => useCustomCardText.value ? cardTextFrom.value : mappedCard.value.text)
const cardExternalTextColor = computed(() => useCustomCardExternalText.value ? cardExternalTextFrom.value : mappedCard.value.external)
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
                :style="screenBG"
              >
                <div
                  class="absolute top-0 left-0 right-0 h-12 text-white flex items-center justify-between px-4 text-[11px]"
                >
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

                <div
                  id="wallpaper-export"
                  class="px-6 mt-20 tracking-wide"
                >
                  <div
                    class="mx-4 my-1 flex items-center justify-between text-md tracking-wide border-b border-dotted"
                    :style="{ color: cardExternalTextColor, borderColor: cardExternalTextColor }"
                  >
                    <span class="whitespace-nowrap">理想大学站</span>
                    <div class="flex items-end gap-2">
                      <span class="text-[50%]">...成功上岸</span>
                      <Icon name="icon:train-line" />
                    </div>
                  </div>
                  <div
                    class="w-full rounded-t-2xl overflow-hidden text-purple-800 shadow-sm px-4 pt-4"
                    :style="{ backgroundColor: cardBackgroundColor, color: cardTextColor }"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center">
                        <div
                          class="w-7 h-7 bg-purple-700 rounded-full flex items-center justify-center font-bold"
                        >
                          B
                        </div>
                        <div class="ml-2">
                          <div class="font-bold">
                            北京地铁
                          </div>
                          <div class="text-[10px] tracking-wide">
                            BEIJING SUBWAY
                          </div>
                        </div>
                      </div>
                      <div
                        class="w-10 h-10 rounded-full border border-purple-700 flex items-center justify-center text-[10px]"
                      >
                        THU
                      </div>
                    </div>

                    <div class="border-t border-dashed border-purple-300 mt-3 mb-1" />

                    <div class="flex justify-between items-center">
                      <div class="text-sm whitespace-nowrap">
                        北京地铁4号线
                      </div>
                      <div class="font-bold whitespace-nowrap">
                        清华大学
                      </div>
                    </div>

                    <div class="mt-4 mb-10 flex justify-between items-end">
                      <div>
                        <div class="text-2xl font-bold">
                          下一站
                        </div>
                        <div class="text-[10px]">
                          Next Station
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-2xl font-bold">
                          圆明园
                        </div>
                        <div class="text-[10px]">
                          YUANMINGYUAN PARK
                        </div>
                      </div>
                    </div>

                    <SubwayLine
                      :stations="['北宫门', '西苑', '圆明园', '北京大学东门', '中关村']"
                      color="#6D28D9"
                    />

                    <!-- 卡片箭头 -->
                    <div class="flex justify-between items-center text-lg">
                      <Icon name="icon:up-half-arrow" />
                      <Icon name="icon:up-half-arrow" />
                    </div>
                  </div>

                  <div
                    class="relative h-5 flex items-center"
                    :style="{ backgroundColor: cardBackgroundColor }"
                  >
                    <!-- 左侧圆点 -->
                    <div
                      class="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                      :style="screenBG"
                    />
                    <!-- 虚线 -->
                    <div class="flex-1 border-t-[4px] border-dotted border-purple-300 mx-4" />
                    <!-- 右侧圆点 -->
                    <div
                      class="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                      :style="screenBG"
                    />
                  </div>

                  <!-- 校训：卡片底部内容 -->
                  <MottoCard
                    :style="{ backgroundColor: cardBackgroundColor, color: cardTextColor }"
                    :cn-lines="['自强不息', '厚德载物']"
                    :en-lines="['Tsinghua', 'University']"
                  />
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

                <!-- <div class="absolute bottom-24 left-1/2 -translate-x-1/2">
                  <div class="px-6 py-2 rounded-full bg-white/80 text-black text-sm backdrop-blur-sm shadow-md transition-transform duration-200 hover:scale-110 hover:-translate-y-0.5">
                    上滑解锁
                  </div>
                </div> -->

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
            v-model:use-custom-card-bg="useCustomCardBg"
            v-model:card-bg-from="cardBgFrom"
            v-model:use-custom-card-text="useCustomCardText"
            v-model:card-text-from="cardTextFrom"
            v-model:use-custom-card-external-text="useCustomCardExternalText"
            v-model:card-external-text-from="cardExternalTextFrom"
          />
        </div>
      </div>
    </div>
  </div>
</template>
