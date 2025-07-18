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
          autocomplete="off"
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
          autocomplete="off"
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
          autocomplete="off"
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
        <div class="flex gap-1 text-xs">
          <span>支持Markdown语法</span>
          <button class="cta flex items-center">
            <span class="hover-underline-animation"> 随机一言 </span>
            <Icon icon="tabler:arrows-shuffle" style="color: #adafb0"></Icon>
          </button>
        </div>
        <div class="flex items-center cta gap-1">
          <span>{{ formValue.content.length }}/500</span>
          <button class="send-button flex items-center gap-1" @click="btn_submit">
            <Icon
              icon="majesticons:airplane-flight-2-line"
              class="text-[var(--font-color)]"
            ></Icon>
            <span style="font-size: 14px; color: var(--font-color)">送信</span>
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

  formValue.value.content = "";
};
</script>

<style src="./style.scss" scoped></style>
