<script setup lang="ts">
import Head from './components/head.vue'
</script>

<template>
  <Head></Head>
  <div class="pt-[4rem] m-[5rem] ml-[1rem] mr-[1rem] md:m-[5rem] ">
    <router-view></router-view>
  </div>

  <loading />
  <HoverButton />
</template>

<style src="./md-style.scss"></style>
<style lang="scss">
  body{
    background: var(--background);
    // background: aqua;
  }
</style>
