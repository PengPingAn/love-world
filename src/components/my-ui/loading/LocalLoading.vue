<template>
  <div
    class="my-loading"
    :style="{ height: props.isMaxHeight ? '100vh' : 'auto' }"
    v-show="props.loading"
  >
    <img src="/src/assets/svg/awaitIcon.svg" alt="Await Icon" style="width: 40px" />
    <div style="width: 100%; text-align: center; margin: 30px" class="text-[var(--font-color)]">
      {{ textList[index] }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  isFull: {
    type: Boolean,
    default: false
  },
  isMaxHeight: {
    type: Boolean,
    default: false
  }
})
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

<style scoped>
.my-loading {
  /* top: 0;
    position: absolute; */
  z-index: 10000;
  width: 100%;
  height: 100vh;
  align-content: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  /* padding: 50px; */
}

/* 设置位置 */
.loading {
  /* position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
  height: 40px;
  display: flex;
  /* 设置子项在y轴方向居中，应该是设置起点在中间，非常有用，不然动画很怪 */
  align-items: center;
  z-index: 100;
  /* flex-wrap: wrap; */
}

/* 小竖条 */
.item {
  height: 0px;
  width: 5px;
  background: rgb(109, 98, 98);
  /* 加margin，使竖条之间有空隙 */
  margin: 0px 3px;
  /* 圆角 */
  border-radius: 10px;
  /* 动画：名称、时间、循环 */
  animation: loading 1s infinite;
}

/* 设置动画 */
@keyframes loading {
  0% {
    height: 0px;
  }

  50% {
    height: 50px;
  }

  100% {
    height: 0px;
  }
}

/* 为每一个竖条设置延时 */
.item:nth-child(2) {
  animation-delay: 0.1s;
}

.item:nth-child(3) {
  animation-delay: 0.2s;
}

.item:nth-child(4) {
  animation-delay: 0.3s;
}

.item:nth-child(5) {
  animation-delay: 0.4s;
}

.item:nth-child(6) {
  animation-delay: 0.5s;
}

.item:nth-child(7) {
  animation-delay: 0.6s;
}

.item:nth-child(8) {
  animation-delay: 0.7s;
}
</style>
