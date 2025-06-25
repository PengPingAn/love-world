<template>
  <div class="bg-transparent rounded-xl shadow-2xl m-14 border-white border-solid border">
    <div class="flex items-center p-3" style="border-bottom: 1px solid #fff">
      <div class="px-1">
        <span class="w-4 h-4 rounded-full inline-block bg-red-500 cursor-pointer"></span>
      </div>
      <div class="px-1">
        <span class="w-4 h-4 rounded-full inline-block bg-yellow-400 cursor-pointer"></span>
      </div>
      <div class="px-1">
        <span class="w-4 h-4 rounded-full inline-block bg-green-500 cursor-pointer"></span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>