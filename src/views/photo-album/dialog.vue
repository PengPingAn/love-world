<template>
  <MyModal :title="'相册'" ref="myModal" :lock-scroll="false">
    <div class="flex">
      <div class="w-[70%] max-h-[70vh] overflow-auto relative">
        <div class="absolute w-full h-full flex">
          <LocalLoading :loading="isLoading"></LocalLoading>
        </div>
        <img
          ref="imgRef"
          :src="imgUrl"
          @load="handleLoad"
          @error="handleError"
          class="w-auto max-h-full mx-auto"
        />
      </div>
      <div class="text-base ml-4 leading-[1.5rem] text-sm text-[var(--font-color)]">
        <div class="flex items-center">
          <Icon class="text-[#acacac]" icon="material-symbols:calendar-month-outline"></Icon>
          <span class="text-[#acacac] whitespace-nowrap"> 拍摄时间：</span>2025/05/20 13:14
        </div>
        <div class="flex items-center">
          <Icon class="text-[#acacac]" icon="material-symbols:globe-location-pin-rounded"></Icon>
          <span class="text-[#acacac] whitespace-nowrap">拍摄地点：</span>
          xxx
        </div>
        <div class="flex items-center">
          <Icon class="text-[#acacac]" icon="material-symbols:photo-camera-outline"></Icon>
          <span class="text-[#acacac] whitespace-nowrap">拍摄设备：</span>
          OPPO Find X 8 Ultra
        </div>
        <div>描述</div>
      </div>
    </div>
  </MyModal>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onMounted } from 'vue'
import { Icon, iconLoaded } from '@iconify/vue'

const props = defineProps<{
  imgUrl: string
}>()

const isLoading = ref(false)
const imgRef = ref(null)
const myModal = ref<{ open: () => void } | null>(null) // 明确类型，假设模态框有 open 方法

const open = () => {
  myModal.value?.open()
}

const handleLoad = () => {
  isLoading.value = false
}

const handleError = () => {
  isLoading.value = false
  console.error(`图片加载失败: ${props.src}`)
}

// 监听 src 变化重新加载
watch(
  () => props.imgUrl,
  (newVal) => {
    if (newVal) {
      isLoading.value = true
      // 创建新的 Image 对象强制重新加载
      const img = new Image()
      img.src = newVal
      img.onload = handleLoad
      img.onerror = handleError
    }
  }
)

defineExpose({ open })
</script>
