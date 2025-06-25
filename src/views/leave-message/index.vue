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
      <Comment :data="commentData" :isReply="true" @submit="submit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

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
const commentData = ref([
  {
    id: 1,
    nickName: '张杰',
    content: '祝你们百年好合',
    webSite: 'https://baidu.com',
    imgUrl:
      'https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    time: '大约2小时前',
    children: [
      {
        id: 11,
        nickName: '灵动',
        replyName: '张杰',
        content: '我回复一下',
        webSite: '',
        imgUrl:
          'https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
        time: '大约2小时前'
      }
    ]
  },
  {
    id: 2,
    nickName: '热心市民',
    content: '在爱的旅途中 坚守初心 一路相伴同行 祝福你们爱情长长久久',
    webSite: '',
    imgUrl:
      'https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    time: '大约3小时前',
    children: []
  },
  {
    id: 3,
    nickName: '小石头',
    content: '你们的爱如阳光遍洒 使生活处处充满温暖 祝福长长久久',
    webSite: '',
    imgUrl:
      'https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    time: '大约8小时前',
    children: []
  },
  {
    id: 4,
    nickName: '消炎',
    content: '愿君与卿情长久 朝朝暮暮共欢颜',
    webSite: '',
    imgUrl:
      'https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    time: '大约1天前',
    children: []
  }
])

const toggleDiv = (event: any) => {
  const targetElement = event.target
  // 检查点击事件的目标是否在你的 div 之外
  if (!myDiv.value.contains(targetElement) && !myButton.value.contains(targetElement)) {
    isLeave.value = false
  }
}
onMounted(() => {
  commentData.value.forEach((d) => {
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

  imgIndex.value = Math.floor(Math.random() * 4)
})

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
  height: 100vh;
}
.danmu-container {
  position: relative;
  height: 100vh;
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
