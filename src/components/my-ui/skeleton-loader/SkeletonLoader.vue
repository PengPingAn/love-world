<!-- SkeletonLoader.vue -->
<template>
  <div class="skeleton-wrapper" v-if="type == 'comments'">
    <div class="skeleton-wrapper-avatar">
      <div class="skeleton skeleton-avatar flex-shrink-0"></div>
      <div class="w-full">
        <div class="flex gap-4">
          <div class="skeleton w-[5rem] h-3"></div>
          <div class="skeleton w-[5rem] h-3"></div>
          <div class="skeleton w-[5rem] h-3"></div>
        </div>

        <div class="skeleton skeleton-body"></div>
        <div class="skeleton h-3 w-[10rem]"></div>
      </div>
    </div>
  </div>

  <div class="skeleton-wrapper" v-else>
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-subtitle"></div>
    <div class="skeleton skeleton-body"></div>
    <div class="skeleton skeleton-body"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type: {
    type: String
    default: 'comments' // comments | articles
  }
}>()
</script>

<style lang="scss" scoped>
.skeleton-wrapper {
  width: 100%;
  padding: 1rem 0;
  border-radius: 8px;
  &-avatar {
    display: flex;
    gap: 1rem;
  }
}

.skeleton {
  background: var(--skeleton-gradient-color);
  background-size: 200% 100%;
  animation: loading 2.5s infinite linear;
  margin-bottom: 0.3rem;
  border-radius: 6px;
  &-title {
    height: 25px;
    width: 60%;
  }
  &-subtitle {
    height: 20px;
    width: 80%;
  }

  &-body {
    height: 15px;
    width: 100%;
  }

  &-avatar {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
  }
}

@keyframes loading {
  100% {
    background-position: -200% 0;
  }
  0% {
    background-position: 200% 0;
  }
}
</style>
