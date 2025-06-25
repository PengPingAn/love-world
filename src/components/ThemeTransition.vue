<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  theme: { type: String, default: "light" },
});

const isSwitching = ref(false);
const oldThemeClass = ref("light");
const themeClass = computed(() => (props.theme === "dark" ? "dark" : "light"));

watch(
  () => props.theme,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      oldThemeClass.value = oldVal;
      isSwitching.value = true;
    }
  }
);

function handleAnimationEnd() {
  isSwitching.value = false;
}
</script>

<template>
  <div class="theme-transition-wrapper">
    <!-- 旧主题 -->
    <div v-if="isSwitching" :class="['theme-layer', oldThemeClass]">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>

    <!-- 新主题 -->
    <div
      :class="['theme-layer', themeClass, { 'slide-in': isSwitching }]"
      @animationend="handleAnimationEnd"
    >
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.theme-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: opacity 0.5s ease;
}

/* 举例简单动画 */
.slide-in {
  animation: slideIn 0.5s forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.light {
  background: white;
  color: black;
}

.dark {
  background: black;
  color: white;
}
</style>
