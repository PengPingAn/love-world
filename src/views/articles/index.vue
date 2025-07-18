<template>
  <div class="m-auto max-w-[850px] pt-[3rem] text-[var(--font-color)]">
    <h1 class="text-3xl">全部文章</h1>
    <div class="mt-8" v-for="item in articles" :key="item">
      <HoverCard :article="item" :card="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getArticles } from "@/api/article";
import { onMounted, ref } from "vue";

const articles = ref([]);

onMounted(() => {
  getArticles().then((res) => {
    if (res.code == 200) articles.value = res.data.result;
  });
});
</script>
