<template>
  <!-- From Uiverse.io by JohnnyCSilva -->
  <div
    :style="{ background: color }"
    class="card rounded-lg transition-colors duration-300 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 bg-white rounded-2xl p-8"
  >
    <div>
      <Icon color="bg-[red]" :icon="icon" class="text-[2rem]"></Icon>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const props = defineProps<{
  color: string
  icon: string
}>()
</script>

<style lang="scss" scoped>
/* From Uiverse.io by JohnnyCSilva */
.card {
  width: 100%;
  padding: 1rem;
  margin: auto;
  height: 6rem;
  border-radius: 10px;
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
  align-items: center;
  justify-content: left;
  backdrop-filter: blur(10px);
  transition: 0.3s ease-in-out;
}

.card:hover {
  cursor: pointer;
  transform: scale(1.05);
}
</style>
