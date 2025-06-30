<template>
  <!-- From Uiverse.io by ilkhoeri -->
  <div
    class="h-[3rem] !bottom-[12rem] opacity-0 action-wrap"
    :class="{ 'button-show': showButton }"
  >
    <button
      class="action"
      type="button"
      :class="{ show: showButton }"
      @click="scrollToTop(1200)"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="action-icon"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path
            fill="currentColor"
            fill-opacity="0"
            stroke-dasharray="20"
            stroke-dashoffset="20"
            d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
          >
            <animate
              attributeName="d"
              begin="0.5s"
              dur="1.5s"
              repeatCount="indefinite"
              values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
            />
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="0.7s"
              dur="0.5s"
              values="0;1"
            />
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
          </path>
          <path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.5s"
              dur="0.2s"
              values="14;0"
            />
          </path>
        </g>
      </svg>
      <span class="action-content" data-content="回到顶部"></span>
    </button>
    <div class="backdrop"></div>
  </div>
  <div class="action-wrap">
    <button class="action" type="button" @click="openModel">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="action-icon"
      >
        <path
          fill="currentColor"
          fill-opacity="0"
          d="M11.21 14.18h1.83c1.73 0 3.13 -1.36 3.13 -3.05c0 -1.68 -1.4 -3.05 -3.13 -3.05h-2.65c-1 0 -1.81 0.79 -1.81 1.76v6.84l2.62 -2.51Z"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.6s"
            dur="0.5s"
            values="0;1"
          />
        </path>
        <path
          fill="none"
          stroke="currentColor"
          stroke-dasharray="64"
          stroke-dashoffset="64"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
        </path>
      </svg>
      <span class="action-content" data-content="祝福"></span>
    </button>

    <button class="action" type="button" @click="toggleTheme">
      <Icon v-if="!isDark" class="action-icon" icon="line-md:moon-rising-loop"></Icon>
      <Icon v-else class="action-icon" icon="line-md:moon-to-sunny-outline-loop-transition"></Icon>
      <span class="action-content" :data-content="isDark ? 'Light' : 'Dark'"></span>
    </button>

    <button class="action" type="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="action-icon"
      >
        <defs>
          <symbol id="lineMdCogLoop0">
            <path
              d="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12"
            >
              <animate
                fill="freeze"
                attributeName="d"
                begin="0.9s"
                dur="0.2s"
                values="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12;M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.38 7.2 19 6.12 19.01 6.14C19.01 6.14 20.57 8.84 20.57 8.84C20.58 8.87 18.35 10.59 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12"
              />
            </path>
          </symbol>
        </defs>
        <g fill="none" stroke="currentColor" stroke-width="2">
          <g stroke-linecap="round">
            <path
              stroke-dasharray="20"
              stroke-dashoffset="20"
              d="M12 9c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z"
            >
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0" />
            </path>
            <path
              stroke-dasharray="48"
              stroke-dashoffset="48"
              d="M12 5.5c3.59 0 6.5 2.91 6.5 6.5c0 3.59 -2.91 6.5 -6.5 6.5c-3.59 0 -6.5 -2.91 -6.5 -6.5c0 -3.59 2.91 -6.5 6.5 -6.5Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.2s"
                dur="0.6s"
                values="48;0"
              />
              <set fill="freeze" attributeName="opacity" begin="0.9s" to="0" />
            </path>
          </g>
          <g opacity="0">
            <use href="#lineMdCogLoop0" />
            <use href="#lineMdCogLoop0" transform="rotate(60 12 12)" />
            <use href="#lineMdCogLoop0" transform="rotate(120 12 12)" />
            <use href="#lineMdCogLoop0" transform="rotate(180 12 12)" />
            <use href="#lineMdCogLoop0" transform="rotate(240 12 12)" />
            <use href="#lineMdCogLoop0" transform="rotate(300 12 12)" />
            <set fill="freeze" attributeName="opacity" begin="0.9s" to="1" />
            <animateTransform
              attributeName="transform"
              dur="30s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </g>
        </g>
      </svg>
      <span class="action-content" data-content="设置"></span>
    </button>

    <div class="backdrop"></div>
  </div>

  <MyModal :title="'祝福留言'" ref="myModal" :lock-scroll="false">
    <LeaveMessageForm />
  </MyModal>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useEditorThemeStore } from '@/stores/pinia'
import { playThemeTransition } from '@/utils/themeTransition'
import { Icon } from '@iconify/vue'

const showButton = ref(false)
const isHover = ref(false)
let lastScrollY = 0
const myModal = ref(null)
const userStore = useEditorThemeStore()
const isDark = ref(null)

// 带节流的滚动处理
const handleScroll = () => {
  const currentScroll = window.scrollY

  // 向下滚动时隐藏
  if (currentScroll > lastScrollY) {
    showButton.value = true
  } else {
    showButton.value = currentScroll > 200
  }

  lastScrollY = currentScroll
}

// 带进度显示的滚动
let scrollAnimationId: number | null = null

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

const scrollToTop = (duration = 600) => {
  if (scrollAnimationId !== null) {
    cancelAnimationFrame(scrollAnimationId)
  }

  const start = window.scrollY || document.documentElement.scrollTop
  const startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutQuart(progress)

    const scrollY = start * (1 - eased)
    window.scrollTo(0, scrollY)

    if (progress < 1) {
      scrollAnimationId = requestAnimationFrame(animate)
    } else {
      scrollAnimationId = null
      removeInterruptListeners()
    }
  }

  const cancelScroll = () => {
    if (scrollAnimationId !== null) {
      cancelAnimationFrame(scrollAnimationId)
      scrollAnimationId = null
    }
    removeInterruptListeners()
  }

  const removeInterruptListeners = () => {
    window.removeEventListener('wheel', cancelScroll, { passive: true })
    window.removeEventListener('touchstart', cancelScroll, { passive: true })
  }

  window.addEventListener('wheel', cancelScroll, { passive: true })
  window.addEventListener('touchstart', cancelScroll, { passive: true })

  scrollAnimationId = requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  const html = document.documentElement
  html.classList.add(userStore.$state.editorTheme)
  isDark.value = html.classList.contains('dark')
  console.log(isDark.value)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const openModel = () => {
  console.log('------------')
  myModal.value.open()
}

// 切换主体颜色（直接修改html的类）
const toggleTheme = () => {
  const html = document.documentElement
  const _isDark = html.classList.contains('dark')

  if (_isDark) {
    html.classList.remove('dark')
  }
  isDark.value = !_isDark
  playThemeTransition(!_isDark, () => {
    if (_isDark) {
      // 切换为亮色
      userStore.setUser('light')
    } else {
      html.classList.add('dark') // 切换为暗黑
      userStore.setUser('dark')
    }
  })
}
</script>

<style lang="css" scoped>
/* From Uiverse.io by ilkhoeri */
.action-wrap {
  z-index: 100;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 9999px;
  right: 1rem;
  bottom: 1rem;
  transition: opacity 0.5s ease-in-out, visibility 0.5s;
}

.backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.backdrop::before {
  content: '';
  position: absolute;
  height: 10.5rem;
  width: 10.5rem;
  border-radius: 9999px;
  background: #eef1f496;
  animation: rotate 1.5s linear infinite;
}
.backdrop::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  z-index: 1;
}

.action {
  --sz-light-hover: 60px;
  --rd-light-hover: 9999px;
  --l-light-hover: 14px;
  --cl-light: #0000;
  --cr-light: #af40ff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform, color, background-color, 300ms ease;
  height: 3.5rem;
  width: 3.5rem;
  border: none;
  color: #444444;
  background: none transparent;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
}

.action-icon {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 9;
  padding: 0.5rem;
  border-radius: 9999px;
  background-color: #f1f1f1;
  transition: transform, color, background, 300ms ease;
}

.action-content {
  --sz-light-hover: 100px;
  --rd-light-hover: 6px;
  --l-light-hover: 0px;
  --cl-light: #fff;
  --cr-light: #af40ff;
  transition: transform, 400ms ease;
  opacity: 0;
  font-size: 1.25rem;
  line-height: 1.5;
  background-color: inherit;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
  width: max-content;
  height: 1.75rem;
  padding: 8px 1px;
  position: absolute;
  right: 0;
  left: auto;
  z-index: -1;
  border: 1px solid #ccc;
}

.action-content::before {
  content: attr(data-content);
  transition: transform, 300ms ease;
  text-transform: capitalize;
  font-size: medium;
  font-weight: 600;
  z-index: 1;
  transform: translateX(-100%);
  background-color: #fff;
  border-radius: calc(var(--rd-light-hover) - 2px);
  padding-inline: 4px;
}

.action::after,
.action-content::after {
  content: '';
  opacity: 0;
  position: absolute;
  border-radius: var(--rd-light-hover);
  transition: all 50ms ease 200ms;
  background: conic-gradient(
    from 45deg at 50% 50%,
    var(--cl-light),
    var(--cr-light),
    var(--cl-light),
    var(--cl-light),
    var(--cl-light),
    var(--cr-light),
    var(--cl-light),
    var(--cl-light),
    var(--cl-light)
  );
}

.action:hover .action-icon {
  color: #000;
  background-color: #fff;
  transform: scale(1.4) translate3d(-7px, 0px, 12px);
}

.action:hover::after,
.action-content::after {
  /* height: var(--sz-light-hover);
  width: var(--sz-light-hover);
  left: var(--l-light-hover);
  opacity: 1;
  animation: rotate 4s linear infinite; */
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(1turn);
  }
}

.action:hover .action-content {
  color: #000;
  background-color: #fff;
  opacity: 1;
  width: max-content;
  /* left: calc(100% + 24px); */
  /* left: calc(-100%); */
  z-index: 9;
  right: calc(100% + 10px);
  left: auto;
}

.action:hover .action-content::before {
  transform: translateX(0px);
}

.button-show {
  opacity: 1;
}
</style>
