<template>
  <span style="display: inline-block; text-indent: 0em">
    <span class="hover-link" style="text-decoration: none; display: flex">
      <Icon icon="line-md:question-circle"></Icon>
      正在被{{ props.socketCount }}人围观
    </span>

    <span class="p-a-span slide-top">
      这是如何实现的？ <br />
      当你打开这个网站时，会自动建立 WebSocket连接<br />
      当成功连接后服务器会推送当前浏览页面的人数。 <br />
      WebSocket 用于通知站点，包括不限于站点的更新。
      <hr class="my-1.5 border-gray-300 dark:border-gray-600" />
      <div>
        当前 Socket 状态：
        <div
          class="loader"
          :style="{ '--loader-bg-color': props.socketStatus ? '#69ffa8' : '#ef1010' }"
        ></div>
        {{ props.socketStatus ? "已连接" : "已断开" }}
      </div>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    socketCount?: number;
    socketStatus?: boolean;
  }>(),
  {
    socketCount: 0,
    socketStatus: false,
  }
);
</script>

<style scoped lang="scss">
.hover-link {
  position: relative !important;
  cursor: help;
  font-size: 13px;
  color: var(--font-color) !important;
  align-items: center;
  text-decoration: none !important;
}
.hover-link:hover::before {
  width: 0 !important;
  content: none !important; /* 如果需要彻底隐藏伪元素 */
}
.p-a-span {
  line-height: 1.2rem !important;
  font-size: 14px;
  font-family: "Noto Serif SC", serif !important;
  right: 10px !important;
}
/* From Uiverse.io by Yaya12085 */
.loader {
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: var(--loader-bg-color);
  animation: 1.5s pulse infinite ease-in-out;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 var(--loader-bg-color);
  }

  100% {
    box-shadow: 0 0 0 5px #69ffa800;
  }
}
</style>
