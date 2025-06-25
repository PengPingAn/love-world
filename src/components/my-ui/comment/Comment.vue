<template>
  <div>
    <template v-for="(item, index) in data" :key="item.id">
      <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div class="mt-[1rem] mb-[1rem] flex gap-4 text-[var(--font-color)]">
          <div class="flex gap-4">
            <div :style="{ cursor: item.webSite ? 'pointer' : 'default' }" style="height: 0">
              <div v-if="item.imgUrl" class="w-[2.5rem] h-[2.5rem]">
                <img :src="item.imgUrl" class="rounded-full" />
              </div>

              <div
                v-else
                class="w-[2.5rem] h-[2.5rem] bg-[#dadadaab] leading-[2.5rem] text-center text-xl rounded-full font-serif"
              >
                {{ item.name.substring(0, 1) }}
              </div>
            </div>
          </div>

          <div class="w-full font-serif flex flex-col gap-2">
            <div class="leading-4 flex gap-2 items-end">
              <div class="font-bold">
                {{ item.nickName }}
              </div>
              <div class="text-xs text-[#adafb1]">
                {{ item.time }}
              </div>
            </div>
            <div class="hover-area">
              <div class="bg-[#cce1f3a8] rounded text-lg hover-trigger">
                {{ item.content }}
                <div class="hover-content" @click="btn_show(item.id)" v-if="isReply">
                  <Icon icon="mage:message-conversation" style="color: #000"></Icon>
                </div>
              </div>
            </div>

            <div
              class="reply-form-container"
              :style="{
                gridTemplateRows: activeReplyId === item.id ? '1fr' : ''
              }"
            >
              <div>
                <LeaveMessageForm @submit="submit" />
              </div>
            </div>
            <ChildedComment :data="item.children" :isReply="isReply" @submit="submit" />
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  data: []
  isReply: boolean
}>()

const activeReplyId = ref(null)
const replyContent = ref('')

const beforeEnter = (el: HTMLElement) => {
  el.style.opacity = 0
  el.style.transform = 'translateY(10px)'
}

const enter = (el: HTMLElement, done: Function) => {
  el.offsetHeight // trigger reflow to restart animation
  el.style.transition = 'opacity 0.3s, transform 0.3s'
  el.style.opacity = 1
  el.style.transform = 'translateY(0)'
  done()
}

const leave = (el: HTMLElement, done: Function) => {
  el.style.transition = 'opacity 0.3s, transform 0.3s'
  el.style.opacity = 0
  el.style.transform = 'translateY(10px)'
  done()
}

const btn_show = (id: any) => {
  if (activeReplyId.value === id) {
    activeReplyId.value = null
  } else {
    activeReplyId.value = id
    replyContent.value = ''
  }
}
const emit = defineEmits(['submit'])
const submit = (val, id = null) => {
  let newId = id
  let replyName = null
  if (id) {
    newId = findParentByChildId(id).id
    replyName = findAnyCommentById(id).nickName
  } else {
    newId = activeReplyId.value
    replyName = findAnyCommentById(newId).nickName
  }

  emit('submit', val, newId, replyName)
}
const findParentByChildId = (childId) => {
  return props.data.find(
    (comment) =>
      Array.isArray(comment.children) && comment.children.some((child) => child.id === childId)
  )
}
const findAnyCommentById = (id) => {
  for (const comment of props.data) {
    if (comment.id === id) {
      return comment
    }
    const child = comment.children.find((child) => child.id === id)
    if (child) {
      return child
    }
  }
  return null
}
</script>

<style src="./style.scss"></style>
<style scoped>
/* 为过渡定义必要的样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
