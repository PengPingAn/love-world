<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import Head from "./components/head.vue";
import Foot from "@/views/foot/index.vue";
import ThemeTransition from "./components/ThemeTransition.vue";
import { useRoute } from "vue-router";

const fireflyContainer = ref<HTMLDivElement | null>(null);
const numFireflies = 20;
let observer: MutationObserver;

function createFireflies() {
  if (!fireflyContainer.value) return;
  for (let i = 0; i < numFireflies; i++) {
    const firefly = document.createElement("div");
    firefly.classList.add("firefly");

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    firefly.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;

    const delay = Math.random() * 3;
    firefly.style.animationDelay = `${delay}s, ${delay}s`;

    fireflyContainer.value.appendChild(firefly);
    animateFly(firefly, startX, startY);
  }
}

function clearFireflies() {
  fireflyContainer.value?.replaceChildren(); // 更快清除所有 firefly
}

function animateFly(el: HTMLElement, startX: number, startY: number) {
  const duration = 15000 + Math.random() * 25000;
  const deltaX = (Math.random() - 0.5) * 1600;
  const deltaY = (Math.random() - 0.5) * 1600;

  el.animate(
    [
      { transform: `translate3d(${startX}px, ${startY}px, 0)` },
      { transform: `translate3d(${startX + deltaX}px, ${startY + deltaY}px, 0)` },
      { transform: `translate3d(${startX}px, ${startY}px, 0)` },
    ],
    {
      duration,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
    }
  );
}

function checkTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    createFireflies();
  } else {
    clearFireflies();
  }
}

onMounted(() => {
  checkTheme();
  observer = new MutationObserver(() => {
    checkTheme();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

// 当前主题（'light' or 'dark'）
const theme = ref("light");

// 模拟切换（你可以替换成按钮触发）
const route = useRoute();
watch(route, () => {
  theme.value = theme.value === "light" ? "dark" : "light";
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Head />
    <div class="firefly-container" ref="fireflyContainer" aria-hidden="true"></div>

    <div class="pt-[4rem] m-[5rem] ml-[1rem] mr-[1rem] md:m-[5rem] flex-1">
      <router-view />
    </div>

    <loading />
    <HoverButton />
    <Foot />
  </div>
</template>

<style src="./md-style.scss"></style>

<style lang="scss">
body {
  background: var(--background);
}

body:before {
  padding: 20px;
  background-repeat: repeat;
  background-position: center center;
  background-size: auto, cover;
  inset: 0;
  position: fixed;
  content: "";
  z-index: -999;
}

.firefly-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -998; // 比 body:before 稍高，但不遮挡内容
  background: transparent;
  overflow: hidden;
}

.firefly {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, #f3f3ef 0%, #dfdddd 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 10px 1px #ffaa00;
  opacity: 0;
  animation: fadeIn 0.07s ease-out forwards, blink 2.5s infinite ease-in-out;
  will-change: transform, opacity;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.8;
  }
}

@keyframes blink {
  0%,
  100% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.3);
  }
}

.theme-transition-overlay {
  position: fixed;
  inset: 0;
  z-index: -9999;
  pointer-events: none;
  // animation-duration: 0.3s;
  animation-fill-mode: forwards;
  opacity: 1;
  transform: translateY(0);
}

/* 拉下黑色幕布（亮 → 暗） */
.theme-transition-overlay.to-dark {
  background-color: rgb(29, 29, 29);
  animation-name: slide-in-from-top;
}

/* 暗黑 → 亮色：推出遮罩（上白下黑）从下往上 */
.theme-transition-overlay.to-light {
  background-color: rgb(29, 29, 29);
  animation-name: slide-out-to-top;
}

@keyframes slide-in-from-top {
  0% {
    transform: translateY(-100%);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out-to-top {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 1;
  }
}
</style>
