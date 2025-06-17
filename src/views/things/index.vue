<template>
  <div class="max-w-5xl mx-auto p-4">
    <h1 class="text-2xl font-bold text-pink-500 mb-4">我们要一起做的事 💑</h1>
    <div class="flex justify-center">
      <!-- From Uiverse.io by Pradeepsaranbishnoi -->
      <div class="container-tab">
        <div class="tabs">
          <input type="radio" id="radio-1" name="tabs" />
          <label class="tab" for="radio-1">未完成</label>
          <input type="radio" id="radio-2" name="tabs" checked="" />
          <label class="tab" for="radio-2">全部</label>
          <input type="radio" id="radio-3" name="tabs" />
          <label class="tab" for="radio-3">已完成</label>
          <span class="glider"></span>
        </div>
      </div>
    </div>
    <div class="task" draggable="true" v-for="item in thingsData">
      <!-- From Uiverse.io by LeonKohli -->
      <div class="uv-checkbox-wrapper">
        <input
          type="checkbox"
          id="uv-checkbox"
          class="uv-checkbox"
          :checked="item.isDone"
          disabled
        />
        <label for="uv-checkbox" class="uv-checkbox-label">
          <div class="uv-checkbox-icon">
            <svg viewBox="0 0 24 24" class="uv-checkmark">
              <path d="M4.1,12.7 9,17.6 20.3,6.3" fill="none"></path>
            </svg>
          </div>
        </label>
      </div>
      <div class="md-collapse">
        <div class="md-collapse-title">
          <div class="md-collapse-icon"></div>
          {{ item.title }}
        </div>
        <div class="md-collapse-body">
          <div class="md-collapse-inner open">
            <div
              class="carousel-wrapper"
              data-autoplay="false"
              v-if="item.imgList && item.imgList.length > 0"
            >
              <div class="container-btn prev">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#5b5b5b"
                    stroke-dasharray="12"
                    stroke-dashoffset="12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12l7 -7M8 12l7 7"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      dur="0.3s"
                      values="12;0"
                    ></animate>
                  </path>
                </svg>
              </div>
              <div class="container">
                <div class="container-item" v-for="img in item.imgList">
                  <img :src="img" alt="" class="medium-zoom-image" />
                </div>
              </div>
              <div class="container-indicators">
                <span class="dot" v-for="dot in item.imgList"></span>
              </div>
              <div class="container-btn next">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#5b5b5b"
                    stroke-dasharray="12"
                    stroke-dashoffset="12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12l-7 -7M16 12l-7 7"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      dur="0.3s"
                      values="12;0"
                    ></animate>
                  </path>
                </svg>
              </div>
            </div>
            <div class="text-xl m-4 text-center" v-else>还在计划中呢~</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const thingsData = ref([
  {
    isDone: true,
    doneTime: "2025年6月13日",
    title: "一起旅行",
    imgList: [
      "https://pic4.zhimg.com/v2-57ed22547faf8635adb245964aee8a0b_r.jpg",
      "https://www.2008php.com/2013_Website_appreciate/2013-03-17/20130317005445.jpg",
    ],
  },
  {
    isDone: true,
    doneTime: "2023年12月13日",
    title: "一起做饭",
    imgList: ["https://pic4.zhimg.com/v2-57ed22547faf8635adb245964aee8a0b_r.jpg"],
  },
  {
    isDone: false,
    doneTime: null,
    title: "一起去海边",
    imgList: [],
  },
]);
</script>

<style lang="scss" scoped>
/* From Uiverse.io by Yaya12085 */
.task {
  position: relative;
  color: #2e2e2f;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
  margin-bottom: 1rem;
  border: 2px dashed transparent;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  width: 100%;
}

.task:hover {
  box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
  border-color: rgba(162, 179, 207, 0.2) !important;
}
.md-collapse {
  // border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  margin: 0;
  transition: all 1.4s ease;

  &-icon {
    transition: transform 0.3s ease;
    background-image: url("@/assets/svg/down-line.svg");
    display: inline-block;
    width: 24px;
    height: 24px;
    background-size: contain;
    transform: scale(0.7) rotate(-90deg);
    background-repeat: no-repeat;
  }
}

.md-collapse-title {
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 2px;

  &:hover {
    color: #023e6f;
  }
}

.md-collapse-body {
  border-radius: 6px;
  height: 0;
  overflow: hidden;
  will-change: height;
  transition: height 0.5s cubic-bezier(0.25, 1.5, 0.5, 1); // 弹性曲线
}

.md-collapse-body.open {
  /* 用 JS 动态计算高度 */
  background: #ffc0cb33;
}

.md-collapse-icon.rotate {
  transform: scale(0.7) rotate(0deg);
}

.md-collapse-inner {
  padding: 10px;
  background: #fff0f5;
  animation: bounceIn 0.3s ease;
}

@keyframes bounceIn {
  0% {
    transform: scaleY(0.95);
  }

  50% {
    transform: scaleY(1.05);
  }

  100% {
    transform: scaleY(1);
  }
}
/* From Uiverse.io by LeonKohli */
.uv-checkbox-wrapper {
  display: inline-block;
  position: absolute;
  top: -15px;
  left: -15px;
}

.uv-checkbox {
  display: none;
}

.uv-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.uv-checkbox-icon {
  position: relative;
  width: 2em;
  height: 2em;
  border: 2px solid #ccc;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  transition: border-color 0.3s ease, border-radius 0.3s ease;
  background-color: #ccc;
}

.uv-checkmark {
  position: absolute;
  top: 0.1em;
  left: 0.1em;
  width: 1.6em;
  height: 1.6em;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.uv-checkbox:checked + .uv-checkbox-label .uv-checkbox-icon {
  border-color: #5de099;
  border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
  background-color: #5de099;
}

.uv-checkbox:checked + .uv-checkbox-label .uv-checkmark {
  stroke-dashoffset: 0;
}

.uv-checkbox:checked + .uv-checkbox-label .uv-checkbox-text {
  color: #6c5ce7;
}

/* From Uiverse.io by Pradeepsaranbishnoi */
.tabs {
  display: flex;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.75rem;
  border-radius: 99px;
}

.tabs * {
  z-index: 2;
}

.container-tab {
  margin: 2rem;
  width: fit-content;
  display: flex;
  justify-content: center;
}
.container-tab input[type="radio"] {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 100px;
  font-size: 0.8rem;
  color: black;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
  font-size: 1.2rem;
  font-family: "Courier New", Courier, monospace;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.8rem;
  height: 0.8rem;
  position: absolute;
  top: 10px;
  left: 30%;
  font-size: 10px;
  margin-left: 0.75rem;
  border-radius: 50%;
  margin: 0px;
  background-color: #e6eef9;
  transition: 0.15s ease-in;
}

.container-tab input[type="radio"]:checked + label {
  color: #f661dd;
}

.container-tab input[type="radio"]:checked + label > .notification {
  background-color: #f661dd;
  color: #fff;
  margin: 0px;
}

.container-tab input[id="radio-1"]:checked ~ .glider {
  transform: translateX(0);
}

.container-tab input[id="radio-2"]:checked ~ .glider {
  transform: translateX(100%);
}

.container-tab input[id="radio-3"]:checked ~ .glider {
  transform: translateX(200%);
}

.glider {
  position: absolute;
  display: flex;
  height: 30px;
  width: 100px;
  background-color: #e6eef9;
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

@media (max-width: 700px) {
  .tabs {
    transform: scale(0.6);
  }
}
</style>
