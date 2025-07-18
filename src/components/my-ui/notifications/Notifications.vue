<template>
  <transition name="slide-fade" @after-leave="handleAfterLeave">
    <!-- From Uiverse.io by akshat-patel28 -->
    <div class="card" v-if="visible" ref="cardRef">
      <svg
        class="wave"
        :class="type"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
          fill-opacity="1"
        ></path>
      </svg>

      <div class="icon-container">
        <Icon :icon="iconMap[type]" :class="type + '-text'"></Icon>
      </div>
      <div class="message-text-container">
        <!-- <p class="message-text">Info message</p> -->
        <p class="sub-text">{{ content }}</p>
      </div>
      <button @click="close">
        <Icon icon="pixelarticons:close"></Icon>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  content: String,
  type: {
    type: String,
    default: "info",
  },
  duration: {
    type: Number,
    default: 3000,
  },
  onClose: Function, // 可选：通知 message.ts 卸载 DOM
});

const cardRef = ref<HTMLElement>();
const visible = ref(false);
const iconMap: Record<string, string> = {
  info: "streamline-flex:information-circle",
  success: "mdi:success-circle-outline",
  warning: "typcn:warning-outline",
  error: "fluent:shield-error-16-regular",
};

onMounted(() => {
  // 等 DOM 挂载后再触发进入动画
  requestAnimationFrame(() => {
    visible.value = true;
  });

  setTimeout(() => {
    close();
  }, props.duration);
});

const handleAfterLeave = () => {
  props.onClose?.();
};
const close = () => {
  visible.value = false;
};

defineExpose({ close, cardRef });
</script>

<style lang="scss" scoped>
/* From Uiverse.io by akshat-patel28 */
.card {
  position: fixed;
  z-index: 100;
  width: 330px;
  height: 60px;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 10px 15px;
  background-color: #ffffff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  right: 1rem;
  bottom: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 15px;
  transition: bottom 0.3s ease, /* 👈 平滑移动 */ opacity 0.3s ease,
    /* 👈 淡入淡出 */ transform 0.3s ease;
}
.wave {
  position: absolute;
  transform: rotate(90deg);
  left: -31px;
  top: 32px;
  width: 80px;
  border: 0;
  background: transparent;
}
.icon-container {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-left: 8px;
  font-size: 1.5rem;
}
.info {
  fill: #4777ff3a;
  &-text {
    color: #4777ff;
  }
}
.success {
  fill: #04d4233a;
  &-text {
    color: #04d423;
  }
}
.warning {
  fill: #d4ae043a;
  &-text {
    color: #d4ae04;
  }
}
.error {
  fill: #ff00003a;
  &-text {
    color: #ff0000;
  }
}
.icon {
  width: 17px;
  height: 17px;
  color: #124fff;
}
.message-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
}
.message-text,
.sub-text {
  margin: 0;
  cursor: default;
}
.message-text {
  color: #124fff;
  font-size: 17px;
  font-weight: 700;
}
.sub-text {
  font-size: 14px;
  color: #555;
}
.cross-icon {
  width: 18px;
  height: 18px;
  color: #555;
  cursor: pointer;
}
/* 动画 */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
</style>
