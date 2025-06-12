<template>
    <div class="bg-white rounded-xl shadow-2xl m-14">
    <div class="flex items-center p-3">
      <div class="px-1">
        <span class="w-4 h-4 rounded-full inline-block bg-red-500 cursor-pointer"></span>
      </div>
      <div class="px-1">
        <span
          class="w-4 h-4 rounded-full inline-block bg-yellow-400 cursor-pointer"
        ></span>
      </div>
      <div class="px-1">
        <span
          class="w-4 h-4 rounded-full inline-block bg-green-500 cursor-pointer"
        ></span>
      </div>
    </div>
    <slot></slot> 
  </div>
</template>