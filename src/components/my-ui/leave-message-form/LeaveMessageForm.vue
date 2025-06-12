<template>
  <div class="p-[3px]">
    <div class="flex gap-6">
      <div class="group">
        <input
          id="query"
          class="input"
          type="search"
          placeholder="昵称*"
          name="searchbar"
          v-model="formValue.nickName"
        />
      </div>
      <div class="group">
        <input
          id="query"
          class="input"
          type="search"
          placeholder="邮箱*"
          name="searchbar"
          v-model="formValue.email"
        />
      </div>
      <div class="group">
        <input
          id="query"
          class="input"
          type="search"
          placeholder="网址"
          name="searchbar"
          v-model="formValue.webSite"
        />
      </div>
    </div>
    <div class="w-full input !h-[10rem] mt-4" style="padding: 0">
      <textarea
        id="query"
        class="textarea"
        type="textarea"
        placeholder="说点什么吧"
        name="searchbar"
        style="resize: none"
        v-model="formValue.content"
      />
      <div style="padding: 0 1rem" class="flex items-center justify-between">
        <div>
          <button class="cta flex items-center">
            <span class="hover-underline-animation"> 随机一言 </span>
            <Icon icon="tabler:arrows-shuffle" style="color: #adafb0"></Icon>
          </button>
        </div>
        <div class="flex items-center cta gap-1">
          <span>{{ formValue.content.length }}/500</span>
          <button class="send-button flex items-center gap-1" @click="btn_submit">
            <Icon icon="majesticons:airplane-flight-2-line"></Icon>
            <span style="font-size: 14px; color: black">送信</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon, iconLoaded } from "@iconify/vue";
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/pinia";

const userStore = useUserStore();
console.log(userStore);
const formValue = ref({
  nickName: "",
  email: "",
  webSite: "",
  content: "",
});
watch(
  () => userStore.$state,
  (state) => {
    formValue.value.nickName = state.name;
    formValue.value.email = state.email;
    formValue.value.webSite = state.webSite;
  },
  { immediate: true } // 页面加载时立即执行一次
);

let index = 0;
const types = ["info", "success", "warning", "error"];
const emit = defineEmits(["submit"]);
const btn_submit = () => {
  // const type = types[index % types.length];
  // window.$message[type](`这是 ${type} 消息 - ${index + 1}`);
  // index++;
  // return;
  if (!formValue.value.nickName || formValue.value.nickName === "") {
    window.$message.warning("取个名字吧");
    return;
  }
  if (!formValue.value.email || formValue.value.email === "") {
    window.$message.warning("邮箱忘记填了呢");
    return;
  }
  if (!formValue.value.content || formValue.value.content === "") {
    window.$message.warning("写点什么吧");
    return;
  }

  userStore.setUser(
    formValue.value.nickName,
    formValue.value.email,
    formValue.value.webSite
  );

  if (formValue.value.content.length > 500) {
    window.$message.warning("内容不要超过500字符");
    return;
  }
  emit("submit", formValue.value);
};
</script>

<style lang="scss" scoped>
/* From Uiverse.io by LightAndy1 */
.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  width: 100%;
}

.input {
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 30px;
  padding: 1rem;
  box-shadow: 0 0 0 1.5px #a5a7af3d, 0 0 25px -17px #a5a7af3d;
  border: 0;
  border-radius: 10px;
  background-color: #a5a7af3d;
  outline: none;
  // color: #a5a7af3d;
  transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: text;
  z-index: 0;
  font-size: 1rem;
}
.textarea {
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 8rem;
  padding: 1rem;
  border: 0;
  border-radius: 10px;
  outline: none;
  background: transparent;
  transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: text;
  z-index: 0;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99999986;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #eee;
  }
}

.input::placeholder {
  color: #9e4080;
}

.input:hover {
  box-shadow: 0 0 0 2.5px #a5a7af3d, 0px 0px 25px -15px #a5a7af3d;
}

.input:focus {
  box-shadow: 0 0 0 2.5px #a5a7af3d;
  animation: scaleAnimation 0.2s;
}

// .input:focus-within {
//   animation: scaleAnimation 0.2s;
// }

.search-icon {
  position: absolute;
  left: 1rem;
  fill: #a5a7af3d;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  z-index: 1;
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
    transform-origin: center center;
  }

  50% {
    transform: scale(0.95);
    transform-origin: center center;
  }

  100% {
    transform: scale(1);
    transform-origin: center center;
  }
}

/* From Uiverse.io by alexmaracinaru */
.cta {
  border: none;
  background: none;
  cursor: pointer;
}

.cta span {
  font-size: 12px;
  text-transform: uppercase;
  color: #adafb0;
}

.cta svg {
  // transform: translateX(-8px);
  transition: all 0.3s ease;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active svg {
  transform: scale(0.9);
}

.hover-underline-animation {
  position: relative;
  color: #adafb0;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #adafb0;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.cta:hover .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* From Uiverse.io by WhiteNervosa */
.send-button {
  font-size: 18px;
  // color: #e1e1e1;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  border: none;
  background: none;
  text-transform: uppercase;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: color;
}

.send-button:hover:after {
  width: 100%;
  left: 0%;
}

.send-button:after {
  content: "";
  pointer-events: none;
  bottom: -2px;
  left: 50%;
  position: absolute;
  width: 0%;
  height: 2px;
  background-color: #9c9393;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: width, left;
}
</style>
