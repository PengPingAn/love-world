<template>
  <div class="p-[3px]">
    <div class="flex gap-6 flex-col items-center">
      <div style="color: var(--font-color)">你发现了神秘的登录的入口</div>

      <!-- 账号输入框 -->
      <div class="group">
        <input
          class="input search-input"
          type="search"
          placeholder="账号*"
          name="account"
          v-model="formValue.account"
          autocomplete="off"
          autofocus
        />
      </div>

      <!-- 密码输入框 + 眼睛按钮 -->
      <div class="group">
        <input
          class="input pr-10"
          :type="showPassword ? 'text' : 'password'"
          placeholder="密码*"
          name="password"
          v-model="formValue.password"
          autocomplete="off"
        />
        <button
          type="button"
          class="absolute right-3 z-10 text-sm"
          @click="showPassword = !showPassword"
        >
          <Icon
            :icon="showPassword ? 'line-md:watch-loop' : 'line-md:watch-off-loop'"
          ></Icon>
        </button>
      </div>

      <!-- 登录按钮 -->
      <div>
        <MyButton :title="'登录'" @click="login"></MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const formValue = ref({
  account: "",
  password: "",
});

const showPassword = ref(false);

const login = () => {
  window.$message.success("你点击了登录按钮，但是没什么用");
};
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 250px;
}

.group::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 5px;
  pointer-events: none;
  z-index: 0;
}

.group:has(.input:focus)::after {
  animation: pulse-ring 0.3s ease-out forwards;
}

.input {
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 30px;
  padding: 1rem;
  padding-right: 2.5rem; /* 为按钮留空间 */
  box-shadow: 0 0 0 1.5px #a5a7af3d, 0 0 25px -17px #a5a7af3d;
  border: 0;
  border-radius: 5px;
  background-color: #a5a7af3d;
  outline: none;
  transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: text;
  z-index: 0;
  font-size: 1rem;
  &.search-input {
    padding-right: 1rem;
  }
}

.input:hover {
  box-shadow: 0 0 0 2.5px #a5a7af3d, 0px 0px 25px -15px #a5a7af3d;
}

.input:focus {
  box-shadow: 0 0 0 1px #3668f374;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 var(--input-border-rgba1);
  }
  100% {
    box-shadow: 0 0 0 7px var(--input-border-rgba2);
  }
}
</style>
