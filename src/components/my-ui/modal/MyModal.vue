<template>
  <!-- 背景遮罩层 -->
  <!-- <transition name="fade">
    <div
      v-show="showModal"
      class="fixed inset-0 bg-black bg-opacity-0 transition-all bg-black/30"
      :class="{ 'bg-opacity-50': showModal, 'backdrop-blur-[2px]': isBlur }"
      style="z-index: 40"
    />
  </transition> -->

  <transition
    name="modal"
    enter-active-class="duration-300 ease-out"
    leave-active-class="duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-3"
  >
    <!-- 模态框内容 -->
    <div
      v-show="showModal"
      class="fixed inset-0 flex items-center justify-center"
      style="z-index: 50"
      :class="{ 'blow-up': isBlowUp }"
    >
      <div
        ref="targetDiv"
        class="bg-color p-4 rounded-lg shadow-xl min-w-[50%] transform transition-all duration-300 ease-in-out backdrop-blur-[2px] fixed max-w-[90%]"
        :class="{
          'opacity-0 scale-95 slide-bottom': !showModal,
          'opacity-100 scale-100 slide-top': showModal,
        }"
      >
        <div class="text-base flex font-semiboldflex items-center justify-between">
          <span> {{ title }} </span>
          <span class="cursor-pointer" @click="close">
            <Icon icon="pixelarticons:close"></Icon>
          </span>
        </div>
        <div class="w-full border-b border-b-[#dfbdbd] mb-4 mt-4"></div>
        <div class="text-gray-600 max-h-[70vh] overflow-auto">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Icon, iconLoaded } from "@iconify/vue";

const props = defineProps<{
  isShow: boolean;
  lockScroll?: boolean; // 控制滚动的
  isBlur?: boolean; //是否模糊背景
  title: string;
}>();

const targetDiv = ref(null);
const isBlowUp = ref(false);
// 自主状态管理
const showModal = ref(false);
const modalContent = ref<HTMLElement | null>(null);

// 动画类计算属性
const modalClasses = computed(() => ({
  "opacity-0 scale-95": !showModal.value,
  "opacity-100 scale-100": showModal.value,
}));

// 对外开放方法
const open = () => {
  showModal.value = true;
  lockScroll();
};

const close = () => {
  showModal.value = false;
  unlockScroll();
};

const lockScroll = () => {
  if (props.lockScroll !== false) {
    // 默认启用
    document.body.style.overflow = "hidden";
  }
};

const unlockScroll = () => {
  if (props.lockScroll !== false) {
    document.body.style.overflow = "auto";
  }
};

// 点击外部关闭
const clickOutsideHandler = (event: MouseEvent) => {
  if (modalContent.value && !modalContent.value.contains(event.target as Node)) {
    close();
  }
};

// 键盘事件监听
const keydownHandler = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

// 点击事件的处理函数
const handleClickOutside = (event) => {
  // 判断点击目标是否在 targetDiv 内部
  if (targetDiv.value && !targetDiv.value.contains(event.target) && showModal.value) {
    console.log("点击了弹窗外部");
    isBlowUp.value = true;
    setTimeout(() => {
      isBlowUp.value = false;
    }, 500);
  }
};

// 生命周期管理
onMounted(() => {
  document.addEventListener("click", clickOutsideHandler);
  document.addEventListener("keydown", keydownHandler);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", clickOutsideHandler);
  document.removeEventListener("keydown", keydownHandler);
  document.removeEventListener("click", handleClickOutside);
  document.body.style.overflow = "auto";
});

// 可选：暴露方法给父组件
defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  backdrop-filter: blur(0);
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  backdrop-filter: blur(2px);
}
.slide-top {
  -webkit-animation: slide-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes slide-top {
  0% {
    -webkit-transform: translateY(100px);
    transform: translateY(100px);
    // -webkit-transform: translateY(0);
    // transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    // -webkit-transform: translateY(-100px);
    // transform: translateY(-100px);
  }
}
@keyframes slide-top {
  0% {
    -webkit-transform: translateY(100px);
    transform: translateY(100px);
    // -webkit-transform: translateY(0);
    // transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    // -webkit-transform: translateY(-100px);
    // transform: translateY(-100px);
  }
}

.slide-bottom {
  -webkit-animation: slide-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes slide-bottom {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    // -webkit-transform: translateY(-100px);
    // transform: translateY(-100px);
  }
  100% {
    -webkit-transform: translateY(-100px);
    transform: translateY(-100px);
    // -webkit-transform: translateY(0);
    // transform: translateY(0);
  }
}
@keyframes slide-bottom {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    // -webkit-transform: translateY(-100px);
    // transform: translateY(-100px);
  }
  100% {
    -webkit-transform: translateY(100px);
    transform: translateY(100px);
    // -webkit-transform: translateY(0);
    // transform: translateY(0);
  }
}

.bg-color {
  background: #f9f3f3f7;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%) !important;
}

.blow-up {
  animation: scaleAnimation 0.3s;
  transform-origin: center center;
  /* 设置缩放中心为元素中心点 */
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
    transform-origin: center center;
  }

  50% {
    transform: scale(1.05);
    /* 在动画中点缩放到1.1倍 */
    transform-origin: center center;
  }

  100% {
    transform: scale(1);
    /* 在动画结束时缩放回原始大小 */
    transform-origin: center center;
  }
}
</style>
