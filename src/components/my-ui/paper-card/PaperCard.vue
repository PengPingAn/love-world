<template>
  <!-- From Uiverse.io by janisar-hyder -->
  <p class="browser-warning">
    If this looks wonky to you it's because this browser doesn't support the CSS property
    'aspect-ratio'.
  </p>
  <div class="stack" @click="jumpPage(url)">
    <div class="card">
      <div class="image">
        <div class="text-title text-[var(--font-color)]">
          {{ title }}
        </div>
        <div class="text-desc">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  url: string
}

const props = withDefaults(defineProps<Props>(), {
  sparklesCount: 10,
  colors: () => ({ first: '#9E7AFF', second: '#FE8BBB' })
})

const emit = defineEmits(['jumpPage'])
const jumpPage = (item) => {
  emit('jumpPage', item)
}
</script>

<style lang="scss" scoped>
/* From Uiverse.io by janisar-hyder */
img {
  display: block;
  max-width: 60%;
}

.stack {
  width: 100%;
  max-width: 300px;
  transition: 0.25s ease;
  margin: auto;
  &:hover {
    transform: rotate(5deg);
    .card:before {
      transform: translatey(-2%) rotate(-4deg);
    }
    .card:after {
      transform: translatey(2%) rotate(4deg);
    }
  }
}

.card {
  aspect-ratio: 3 / 2;
  border: 2px solid var(--paper-card-border-color);
  background-color: var(--paper-card-bg-color);
  position: relative;
  transition: 0.15s ease;
  cursor: pointer;
  padding: 5% 5% 15% 5%;
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    border: 2px solid var(--paper-card-border-color);
    background-color: var(--paper-card-bg-color);
    transform-origin: center center;
    z-index: -1;
    transition: 0.15s ease;
    top: 0;
    left: 0;
  }

  &:before {
    transform: translatey(-2%) rotate(-6deg);
  }

  &:after {
    transform: translatey(2%) rotate(6deg);
  }
}
.image {
  width: 100%;
  border: 2px solid var(--paper-card-border-color);
  background-color: var(--paper-card-bg-color);
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .text-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bolder;
  }
  .text-desc {
    color: #777575;
    text-align: center;
    margin: 1rem;
  }
}

.browser-warning {
  margin-bottom: 4rem;
}

@supports (aspect-ratio: 1 / 1) {
  .browser-warning {
    display: none;
  }
}
</style>
