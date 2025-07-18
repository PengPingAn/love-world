<template>
  <footer class="foot">
    <div class="foot-container">
      <div class="foot-group">
        <span class="foot-label">关于 <Icon icon="line-md:chevron-right" /></span>
        <a href="/me">关于我</a>
        <a href="">关于本站</a>
        <a href="">关于此项目</a>
      </div>
      <div class="foot-group">
        <span class="foot-label">联系我 <Icon icon="line-md:chevron-right" /></span>
        <a href="">写留言</a>
        <a href="">E-mail</a>
        <a href="">GitHub</a>
      </div>
      <div class="foot-group">
        <span class="foot-label">更多 <Icon icon="line-md:chevron-right" /></span>
        <a href="">Gitee</a>
      </div>
    </div>
    <div class="foot-container">
      <div class="foot-group">
        <span class="foot-label">备案信息 <Icon icon="line-md:chevron-right" /></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style lang="scss" scoped>
.foot {
  min-height: 150px;
  font-size: 0.9rem;
  padding: 2rem 10vw;
  background-color: var(--foot-bg-color);
  color: var(--font-color);
}

.foot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.foot-group {
  display: flex;
  // flex-direction: column;
  gap: 0.5rem;
  min-width: 160px;
}

.foot-label {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

a {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  color: inherit;
  transition: color 0.2s;

  &:hover {
    text-decoration: underline solid;
    color: var(--link-hover-color, #42b983);
  }
}

/* 响应式（如你没用 Tailwind） */
@media (max-width: 640px) {
  .foot-container {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
