<template>
  <div
    v-if="loadingStore.isLoading"
    :class="{ 'h-screen': !isFull }"
    class="flex justify-center items-center flex-col top-0 fixed w-full bg-[#cecece70]"
  >
    <!-- From Uiverse.io by bhaveshxrawat -->
    <section
      class="area flex justify-center z-[1000]"
      :class="[isFull ? 'w-full top-2/4 fixed' : 'relative']"
    >
      <div class="ball"></div>
    </section>
    <div
      class="text-center text-[var(--font-color)]"
      :class="[isFull ? 'w-full top-[calc(50%+4rem)] fixed' : 'mt-12 relative']"
    >
      {{ textList[index] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/pinia'

const loadingStore = useLoadingStore()
const isFull = ref(true)
const index = ref(0)
const textList = ref([
  '别着急，坐和放宽。',
  '皇上别急，奴家正在玩命加载中。',
  '耐心等待，浪漫即将上演。',
  '当大象跳舞时，时间总是稍微放慢了节奏。',
  '计时已启动,正在加载期待与喜悦。',
  '一大波内容即将到来。'
])
index.value = Math.floor(Math.random() * 6)
</script>

<style lang="css" scoped>
/* From Uiverse.io by bhaveshxrawat */
.ball {
  position: relative;
  height: 15px;
  width: 15px;
  background-color: rgb(255, 44, 44);
  border-radius: 50%;
  animation: bounce 1s ease-in-out infinite both;
}

@keyframes bounce {
  0%,
  100% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, 50px) scale(1, 0.77);
  }
}
</style>
@/stores/pinia