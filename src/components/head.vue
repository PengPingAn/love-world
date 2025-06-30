<template>
  <div
    class="bg-[var(--background-head-color)] p-4 fixed w-full z-[999] top-0 backdrop-blur-sm flex items-center"
  >
    <div>
      <button
        v-if="showBackButton"
        @click="handleGoBack"
        class="flex items-center text-[var(--font-color)]"
      >
        <Icon class="text-[1.6rem]" icon="material-symbols:arrow-left-alt-rounded"></Icon>
        返回
      </button>
    </div>
    <div class="m-auto">
      <Signature :loading="loading" />
    </div>
    <div>
      <Tooltip :socketCount="props.socketCount" :socketStatus="props.socketStatus" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon, iconLoaded } from "@iconify/vue";
import Signature from "./signature.vue";

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

const loading = ref(true);
const router = useRouter();
const route = useRoute();

// 定义主页路径（根据实际路由配置修改）
const HOME_PATH = "/";

// 判断是否是主页
const isHome = computed(() => route.path === HOME_PATH);

// 判断是否有上一页历史记录
const hasHistory = computed(() => {
  // 通过浏览器历史记录判断（更准确）
  return window.history.length > 1;

  // 或者通过 Vue Router 状态判断（可选方案）
  // return Boolean(router.options.history.state.back)
});

// 综合显示条件
const showBackButton = computed(() => {
  return !isHome.value && hasHistory.value;
});

// 返回逻辑
const handleGoBack = () => {
  if (hasHistory.value) {
    router.go(-1);
  } else {
    // 没有历史记录时直接跳转主页
    router.push(HOME_PATH);
  }
};
</script>

<style lang="css"></style>
