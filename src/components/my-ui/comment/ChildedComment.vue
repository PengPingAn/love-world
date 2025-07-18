<template>
  <div>
    <template v-for="(item, index) in data" :key="index">
      <div class="flex gap-4 text-[var(--font-color)]">
        <div class="flex gap-4">
          <div
            :style="{ cursor: item.webSite ? 'pointer' : 'default' }"
            style="height: 0"
            @click="jumpUrl(item.webSite)"
          >
            <div v-if="item.imgUrl" class="w-[2rem] h-[2rem]">
              <img :src="item.imgUrl" class="rounded-full" />
            </div>

            <div
              v-else
              class="w-[2rem] h-[2rem] bg-[#dadadaab] leading-[2rem] text-center text-sm rounded-full font-serif"
            >
              {{ item.nickName.substring(0, 1) }}
            </div>
          </div>
        </div>

        <div class="w-full font-serif flex flex-col gap-2">
          <div class="leading-4 flex gap-2 items-end">
            <div class="font-bold text-sm">
              {{ item.nickName }}
            </div>
            <div class="text-xs text-[#adafb1] host-tag" v-if="item.isWebmaster">
              站长
            </div>
            <div class="text-xs text-[#adafb1]">
              {{ item.time }}
            </div>
          </div>
          <div class="hover-area">
            <div
              class="bg-[#cce1f3a8] rounded text-lg hover-trigger flex items-center gap-1"
            >
              <span class="text-[#2397fd]" style="white-space: nowrap"
                >@{{ item.replyName }}</span
              >
              <!-- {{ item.content }} -->
              <MdPreview
                previewTheme="github"
                editorId="editorId"
                :modelValue="item.content"
                style="background: transparent; font-family: 'Noto Serif SC', serif"
                @onGetCatalog="onGetCatalog"
                :theme="userStore.$state.editorTheme"
              />
              <div class="hover-content" @click="btn_show(item.id)" v-if="isReply">
                <Icon icon="mage:message-conversation" style="color: #000"></Icon>
              </div>
            </div>
          </div>
          <div
            class="reply-form-container"
            :style="{
              gridTemplateRows: activeReplyId === item.id ? '1fr' : '',
            }"
          >
            <div>
              <LeaveMessageForm @submit="submit" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { MdPreview } from "md-editor-v3";
import { useEditorThemeStore } from "@/stores/pinia";

const userStore = useEditorThemeStore();
const props = defineProps<{
  data: [];
  isReply: boolean;
}>();

//用于标记当前哪条评论正在显示“回复框”的标志位
const activeReplyId = ref(null);
const replyContent = ref("");

const btn_show = (id: any) => {
  if (activeReplyId.value === id) {
    activeReplyId.value = null;
  } else {
    activeReplyId.value = id;
    replyContent.value = "";
  }
};
const emit = defineEmits(["submit"]);
const submit = (val) => {
  emit("submit", val, activeReplyId.value);
};

const jumpUrl = (url: string) => {
  window.open(url, "_blank");
};
</script>

<style src="./style.scss"></style>
