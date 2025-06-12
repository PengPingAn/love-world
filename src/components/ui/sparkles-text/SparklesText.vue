<template>
  <div
    class="text-7xl font-bold flex justify-center gap-3 flex-col items-center p-10"
    :class="props.class"
  >
    <span class="relative inline-block">
      <template v-for="sparkle in sparkles" :key="sparkle.id">
        <Motion
          :initial="{ opacity: 0, scale: 0, rotate: 75 }"
          :animate="{
            opacity: [0, 1, 0],
            scale: [0, sparkle.scale, 0],
            rotate: [75, 120, 150]
          }"
          :transition="{
            duration: 0.8,
            repeat: Infinity,
            delay: sparkle.delay
          }"
          as="svg"
          class="pointer-events-none absolute z-20"
          :style="{
            left: sparkle.x,
            top: sparkle.y,
            opacity: 0
          }"
          width="21"
          height="21"
          viewBox="0 0 21 21"
        >
          <path
            d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
            :fill="sparkle.color"
          />
        </Motion>
      </template>
      <!-- {{ text }} -->

      <div class="flex justify-center gap-8 flex-col items-center">
        <div class="text-4xl">我们一起走过的</div>
        <div>
          <span style="font-size: 2.5rem">第</span>
          <span style="font-size: 3.5rem">{{ timeDifference.years }}</span>
          <span style="font-size: 2.5rem">年</span>
          <span style="font-size: 3.5rem">{{ timeDifference.months }}</span>
          <span style="font-size: 2.5rem">月</span>
          <span style="font-size: 3.5rem">{{ timeDifference.days }}</span>
          <span style="font-size: 2.5rem">日</span>
          <span style="font-size: 3.5rem">{{ timeDifference.hours }}</span>
          <span style="font-size: 2.5rem">时</span>
          <span style="font-size: 3.5rem">{{ timeDifference.minutes }}</span>
          <span style="font-size: 2.5rem">分</span>
          <span style="font-size: 3.5rem">{{ timeDifference.seconds }}</span>
          <span style="font-size: 2.5rem">秒</span>
        </div>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v'
import { ref, onMounted, onUnmounted } from 'vue'

interface Sparkle {
  id: string
  x: string
  y: string
  color: string
  delay: number
  scale: number
  lifespan: number
}

interface Props {
  text: string
  sparklesCount?: number
  colors?: {
    first: string
    second: string
  }
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  sparklesCount: 10,
  colors: () => ({ first: '#9E7AFF', second: '#FE8BBB' })
})

const sparkles = ref<Sparkle[]>([])

// Generate a new sparkle with randomized properties
function generateStar(): Sparkle {
  const starX = `${Math.random() * 100}%`
  const starY = `${Math.random() * 100}%`
  const color = Math.random() > 0.5 ? props.colors.first : props.colors.second
  const delay = Math.random() * 2
  const scale = Math.random() * 1 + 0.3
  const lifespan = Math.random() * 10 + 5
  const id = `${starX}-${starY}-${Date.now()}`
  return { id, x: starX, y: starY, color, delay, scale, lifespan }
}

// Initialize sparkles array with random stars
function initializeStars() {
  sparkles.value = Array.from({ length: props.sparklesCount }, generateStar)
}

// Update sparkles - regenerate dead ones and update lifespans
function updateStars() {
  sparkles.value = sparkles.value.map((star) => {
    if (star.lifespan <= 0) {
      return generateStar()
    } else {
      return { ...star, lifespan: star.lifespan - 0.1 }
    }
  })
}

let interval: number

const timeDifference = ref({
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
// Start animation loop
onMounted(() => {
  initializeStars()
  interval = window.setInterval(updateStars, 100)

  timeDifference.value = calculateTimeDifference('2023-12-17 00:00:00')
  setInterval(() => {
    timeDifference.value = calculateTimeDifference('2023-12-17 00:00:00')
  }, 1000)
})

// Cleanup on unmount
onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

const calculateTimeDifference = (targetDateTime) => {
  // 将目标日期时间字符串转换为 Date 对象
  var targetDate = new Date(targetDateTime)
  // 获取当前时间
  var currentDate = new Date()

  // 计算时间差（毫秒）
  var timeDifference = currentDate.getTime() - targetDate.getTime()

  // 计算年份差
  var years = currentDate.getFullYear() - targetDate.getFullYear()

  // 获取当前月份和目标日期的月份差
  var currentMonth = currentDate.getMonth()
  var targetMonth = targetDate.getMonth()
  var months = currentMonth - targetMonth

  // 如果月份差为负数，则年份差减1，并补上12个月
  if (months < 0) {
    years--
    months += 12
  }

  // 获取当前日期和目标日期的天数差
  var currentDay = currentDate.getDate()
  var targetDay = targetDate.getDate()
  var days = currentDay - targetDay

  // 如果天数差为负数，则月份差减1，并补上对应的天数
  if (days < 0) {
    months--
    // 获取上个月的总天数
    var lastMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0)
    days += lastMonthDate.getDate()
  }

  // 获取当前时间和目标时间的小时、分钟、秒差
  var hours = currentDate.getHours() - targetDate.getHours()
  var minutes = currentDate.getMinutes() - targetDate.getMinutes()
  var seconds = currentDate.getSeconds() - targetDate.getSeconds()

  // 处理负数情况
  if (seconds < 0) {
    minutes--
    seconds += 60
  }
  if (minutes < 0) {
    hours--
    minutes += 60
  }
  if (hours < 0) {
    days--
    hours += 24
  }

  return {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}
</script>
