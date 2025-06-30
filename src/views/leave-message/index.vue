<template>
  <div class="layout">
    <div class="danmu-container" :style="{ backgroundImage: 'url(' + bgImgList[0] + ')' }">
      <div
        v-for="(danmu, index) in danmus"
        :key="index"
        class="danmu"
        :style="{
          top: `${danmu.top}px`,
          color: danmu.color,
          animationDelay: `${danmu.seconds}s`,
          animation: `solutionMove ${danmu.seconds2}s linear infinite`
        }"
        @animationend="removeDanmu(index)"
      >
        <div class="danmu-tag" :style="{ backgroundColor: danmu.bgColor }">
          <img :src="danmu.imgUrl" style="flex-shrink: 0" />
          {{ danmu.content }}
        </div>
      </div>
    </div>
    <div class="m-auto max-w-[1000px] p-[5rem]">
      <LeaveMessageForm @submit="submit" />
      <SkeletonLoader :type="'comments'" />
      <div>
        <Comment :data="commentData" :isReply="true" @submit="submit" />

        <!-- 骨架屏 -->
        <transition name="fade">
          <div v-if="loading" class="skeletons">
            <SkeletonLoader v-for="i in 3" :key="i" type="comments" />
          </div>
        </transition>

        <!-- 触发器锚点 -->
        <div ref="sentinel" class="sentinel"></div>
      </div>
    </div>
    <Foot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, nextTick } from 'vue'
import Foot from '@/views/foot/index.vue'
import { commentList, fetchComments } from './data'

const circleUrl = ref([
  '/src/assets/wallhaven-1q83qg_3840x1600.png',
  '/src/assets/bg-img/bgimg1.webp'
])
const danmus = ref<any>([])
const sendMessage = ref()
const isLeave = ref(false)
const myButton = ref<any>(null)
const myDiv = ref<any>(null)
const imgIndex = ref(0)
const bgImgList = ref([
  '/src/assets/wallhaven-1q83qg_3840x1600.png',
  '/src/assets/bg-img/bgimg1.webp'
])
const myInput = ref()
const commentData = ref([])
const sentinel = ref(null)
const loading = ref(false)
const finished = ref(false)
let observer = null
let pageIndex = 1

// 模拟异步加载评论
async function loadMore() {
  if (loading.value || finished.value) return
  loading.value = true
  console.log(loading.value)

  // ✅ 暂时断开监听，防止重复触发
  observer?.unobserve(sentinel.value)

  // 模拟接口
  await new Promise((resolve) => setTimeout(resolve, 1000))
  fetchComments(pageIndex++, 10).then((res) => {
    res.data.forEach((e) => {
      commentData.value.push(e)
    })

    // ✅ 数据加载完了就别再监听
    if (commentData.value.length >= 30) {
      finished.value = true
    } else {
      // ✅ 加一点延迟再重新监听，避免继续触发
      setTimeout(() => {
        if (sentinel.value && observer) {
          observer.observe(sentinel.value)
        }
      }, 200)
    }

    loading.value = false
  })
}

const toggleDiv = (event: any) => {
  const targetElement = event.target
  // 检查点击事件的目标是否在你的 div 之外
  if (!myDiv.value.contains(targetElement) && !myButton.value.contains(targetElement)) {
    isLeave.value = false
  }
}
onMounted(() => {
  getAllComment()
  imgIndex.value = Math.floor(Math.random() * 4)

  loadMore()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !loading.value && !finished.value) {
        loadMore()
      }
    },
    {
      root: null,
      rootMargin: '0px', // ⭐ 提前 200px 加载，提高体验
      threshold: 1
    }
  )

  nextTick(() => {
    if (sentinel.value) {
      observer.observe(sentinel.value)
    }
  })
})
onUnmounted(() => {
  observer?.disconnect()
})

const getAllComment = () => {
  commentList.forEach((d) => {
    const top = generateUniqueRandomNumber()
    const randomNumber = Math.floor(Math.random() * 2) // 生成1到10之间的随机整数
    const randomNumber2 = Math.floor(Math.random() * 30) + 10
    danmus.value.push({
      top,
      content: d.content,
      color: 'red',
      seconds: 0,
      seconds2: randomNumber2,
      imgIndex: randomNumber,
      bgColor: '#8e5b19ba',
      imgUrl: d.imgUrl
    })
  })
}
const btnSendMessage = (content, imgUrl) => {
  const top = generateUniqueRandomNumber()
  const randomNumber = Math.floor(Math.random() * 2) // 生成1到10之间的随机整数
  const randomNumber2 = Math.floor(Math.random() * 30) + 10
  danmus.value.push({
    top,
    content: content,
    color: 'red',
    seconds: 0,
    seconds2: randomNumber2,
    imgIndex: randomNumber,
    bgColor: '#198e28ba',
    imgUrl: imgUrl
  })
  sendMessage.value = null
}
const btnShow = () => {
  isLeave.value = true
  myDiv.value.style.opacity = 1
  setTimeout(() => {
    myInput.value?.focus()
  }, 500)
}
const submit = (val, id = null, replyName = null) => {
  let imgUrl =
    'https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'
  const newComment = {
    id: Date.now(), // 使用当前时间戳作为唯一 ID
    nickName: val.nickName,
    replyName: replyName,
    content: val.content,
    webSite: val.webSite,
    imgUrl: imgUrl,
    time: '大约8小时前',
    children: []
  }

  if (id) {
    let data = findAnyCommentById(id)
    // 更新评论的 children 数据
    if (data) {
      data.children.push(newComment)
    }
  } else {
    // 更新主评论数据
    commentData.value.push(newComment)
  }

  btnSendMessage(val.content, imgUrl)
}

const findAnyCommentById = (id) => {
  for (const comment of commentData.value) {
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

const removeDanmu = (index) => {
  // danmus.value.splice(index, 1); // 从弹幕数组中移除对应的弹幕数据
}
// 获取屏幕高度
var screenHeight = window.innerHeight - 150

// 用于存储已生成的随机数
var generatedNumbers = <any>[]

// 生成不重复的随机数函数
function generateUniqueRandomNumber() {
  var randomNumber
  do {
    // 生成随机数，不超过屏幕高度
    randomNumber = Math.floor(Math.random() * screenHeight) + 110
  } while (generatedNumbers.includes(randomNumber)) // 检查随机数是否已存在于数组中

  // 将随机数添加到已生成的随机数数组中
  generatedNumbers.push(randomNumber)

  return randomNumber
}
</script>

<style lang="scss" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
}
.danmu-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-image: url('/src/assets/wallhaven-1q83qg_3840x1600.png');
  background-size: cover;
  background-attachment: fixed;
}

.danmu {
  position: absolute;
  white-space: nowrap;
  font-size: 16px;
  transform: translateX(-100%);
}

.danmu-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background-color: rgba(142, 91, 25, 0.729);
  border-radius: 10px;
  color: #ffffff;
  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
}

.comment-item {
  padding: 50px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  transition: background-color 0.2s;
}

.sentinel {
  height: 1px;
  // background: antiquewhite;
}

.skeletons {
  padding: 12px 0;
  animation: fadeIn 0.3s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style>
@keyframes solutionMove {
  from {
    transform: translateX(100vw); /* 从屏幕右侧外开始 */
  }
  to {
    transform: translateX(-100%); /* 移动到自身宽度100%的左侧 */
  }
}
</style>
