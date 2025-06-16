<template>
  <div class="h-screen flex justify-around flex-col m-[-4rem]">
    <div style="display: grid; grid-template-columns: 40% 60%; align-items: center">
      <div class="flex flex-col w-fit mx-auto items-start">
        <h1 class="text-balance text-center text-4xl font-bold p-2">
          <TextHighlight class="bg-gradient-to-r from-indigo-300 to-purple-300">
            This is our space !
          </TextHighlight>
        </h1>

        <BlurReveal :delay="0.2" :duration="0.75" class="p-2">
          <h2 class="text-3xl font-bold tracking-tighter xl:text-6xl/none sm:text-5xl pb-1">
            远方的朋友
            <span style="animation: hand 2s ease-in-out infinite; position: absolute">👋</span>
          </h2>
          <span class="text-pretty text-xl tracking-tighter xl:text-4xl/none sm:text-3xl">
            欢迎来到我们的小世界
          </span>
        </BlurReveal>
      </div>

      <div class="relative">
        <AnimatedTestimonials :testimonials="testimonials" />
      </div>
    </div>
    <div class="flex items-center text-lg flex-col p-5">
      <div>“总之岁月漫长，然而值得等待”</div>
      <div class="bounce" style="animation: float 2s ease-in-out infinite">
        <Icon icon="meteor-icons:angle-down" width="2rem"></Icon>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-4 pt-24 pb-24 gap-[5rem]">
    <div v-for="item in gridItems" :key="item.title" class="cursor-pointer">
      <PaperCard
        :title="item.title"
        :description="item.description"
        :url="item.url"
        @jumpPage="jumpPage"
      ></PaperCard>
    </div>
  </div>
  <div>
    <SafariCard>
      <SparklesText
        text=""
        :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
        :sparkles-count="20"
        class="text-sm"
      />
    </SafariCard>
  </div>
  <div class="grid grid-cols-1 [@media(min-width:1200px)]:grid-cols-2 gap-8 m-14">
    <template v-for="(item, index) in tags" :key="item">
      <div class="flip-horizontal-bottom" v-scroll-animate>
        <TagCard :color="colorClasses[index % colorClasses.length]" :icon="item.icon">
          <div
            class="flex w-full justify-between items-center"
            style="font-family: 'Noto Serif SC', serif"
          >
            <div class="text-white">
              {{ item.label }}
            </div>
            <div class="text-lg text-white flex flex-col">
              <span>{{ item.time }}</span>
              <span>过了{{ calculateTimeDifference(item.time).totalDays }}天</span>
            </div>
          </div>
        </TagCard>
      </div>
    </template>
  </div>
  <SafariCard>
    <div
      class="flex w-full flex-row items-center pb-10 cursor-pointer justify-start ml-[1rem] mr-[1rem]"
    >
      <AnimatedTooltip :items="people" :isOverflow="true" />
    </div>
  </SafariCard>

  <div
    class="relative flexw-full m-14 flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl"
  >
    <!-- First Marquee -->
    <Marquee pause-on-hover class="[--duration:20s]">
      <ReviewCard
        v-for="review in firstRow"
        :key="review.username"
        :img="review.img"
        :name="review.name"
        :username="review.username"
        :body="review.body"
      />
    </Marquee>

    <!-- Second Marquee (reverse) -->
    <Marquee reverse pause-on-hover class="[--duration:20s]">
      <ReviewCard
        v-for="review in secondRow"
        :key="review.username"
        :img="review.img"
        :name="review.name"
        :username="review.username"
        :body="review.body"
      />
    </Marquee>

    <!-- Left Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
    ></div>

    <!-- Right Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
    ></div>
  </div>

  <div class="grid grid-cols-1 [@media(min-width:1200px)]:grid-cols-2">
    <div class="m-4" v-for="item in 3" :key="item" @click="jumpDetails">
      <HoverCard :card="true"></HoverCard>
    </div>
  </div>

  <InteractiveHoverButton @click="toggleTheme" />
  <div class="flex min-h-64 items-center justify-center">
    <RainbowButton> Rainbow Button </RainbowButton>
  </div>
  <!-- <div class="w-full max-w-[85%] mx-auto rounded-lg bottom-8" v-html="html"></div> -->
  <MyModal :title="'祝福留言'" ref="myModal" :lock-scroll="false">
    <div v-for="item in 100" :key="item">我是内容</div>
  </MyModal>

  <MdEditor
    type="linkAttr"
    target="_blank"
    v-model="content"
    previewTheme="github"
    codeTheme="gradient"
    style="min-height: 80vh"
    @onUploadImg="onUploadImg"
  />

  <MdPreview
    previewTheme="github"
    :editorId="editorId"
    :modelValue="content"
    style="background: transparent; min-height: 90vh; color: var(--font-color)"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useColorMode } from '@vueuse/core'
import { codeToHtml, createHighlighter } from 'shiki'
import { Icon, iconLoaded } from '@iconify/vue'
import { cn } from '@/lib/utils'
import MyModal from '@/components/my-ui/modal/MyModal.vue'
import { useRouter } from 'vue-router'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import 'md-editor-v3/lib/preview.css'

const content = ref(`
:::carousel
https://ss3.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/18d8bc3eb13533fae0a4ef61acd3fd1f41345b6a.jpg
https://pic4.zhimg.com/v2-57ed22547faf8635adb245964aee8a0b_r.jpg
https://www.2008php.com/2013_Website_appreciate/2013-03-17/20130317005445.jpg
https://p7.itc.cn/q_70/images03/20240101/469a5b2a96a346318d190fd0acfe20c3.jpeg
https://pic1.zhimg.com/80/v2-2464893e23ed8c3d2760b446015ef8e8_r.jpg
:::


==你好，我是||Chat GPT||，很高兴认识你==。
||你好，我是Chat GPT，==很高兴认识你==。||

## # ||==生命的旷野==||

~~ warning
export const PlayerScreen: NavigationControllerView = () => {
  return <SheetScreen onClose={() => navigation.dismiss()}></SheetScreen>
}

PlayerScreen.transparent = true
~~

@linkCard[标题][https://q2.itc.cn/q_70/images03/20241013/6fe9a539a055473b8677c734558b462f.jpeg][这是一个描述](https://baidu.com)

:::collapse title=点我展开内容
这是一些默认隐藏的内容。

- 列表项1
- 列表项2
- 列表项3
:::

==落日西沉，炊烟袅袅。==

村里的环境==恬静==而舒适，深秋的风凉爽而不凛冽。@Pingan[此间别处](https://baidu.com)铁栅栏里是一条不长不短的小径，通往一座矮矮的房子。小径边上有一座小假山和一个小水塘，尚且算作修饰。在小屋的@Pingan[此间别处](https://www.xiaohongshu.com/explore/67f0772e000000001c03c216?app_platform=ios&app_version=8.79&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBkEClgWp5ivhriZb0ewmitvTCU6eBGflDb_5bQ1dlbKo=&author_share=1&xhsshare=CopyLink&shareRedId=ODgzMzM1PT82NzUyOTgwNjg0OTk0Sj89&apptime=1745402632&share_id=f3357e8caa26450f8364ee0b937ad4d6)后面可以隐约看见远远的旷野。这是一片广阔之境。

坐在||小方桌旁||，等待饭菜上桌。夹起一口喷香出锅的鸡，配一瓶可乐，一群人围成一顿简单而丰满的晚餐。

夜幕降临，华灯初上。徘徊于小路边，看明亮的小屋，看轮廓模糊的假山，看路旁的小灯发出的点点微光……抬眼，城市里难以见到的点点繁星次第铺展；烟花绽放，破旧的瓦房洒下了昏黄的灯光。再将视野放远，便又是那片若隐若现的旷野。

几个人，一张桌子，一个小院……生命不再困在一个小小的城市里，而是去面对乡下的广阔天地。

不知出于什么想法，这里的一切使我内心有种自由之感，不能说太强烈，但是存在。我意识到我在某种程度上触及到了被繁重生活所蒙蔽的内心深处的快乐与自由。

我说城里人啊，别局限在那狭窄的格子里，去看看外面的世界吧。活着不仅仅是为了==“谋生”==，更是为了遵从内心的自由，听那栅栏门前的声声犬吠，看那旷野之上的点点繁星，探索那摆脱纷繁复杂的纯洁的别样世界。人常言“生命如旷野”，人的内心本来就是一片旷野，只是现实逼迫我们用些所谓的正确去将那本属于我们的纯真隐匿起来罢了。所以请坚信，只要你愿意去探索，去创造，那片独属于你的苍茫旷野必定会得到解脱，热烈而奔放。

>此间别处也一样奔忙，只是他们脚步声里多了些天宽地广。——毛不易《@Pingan[此间别处](https://baidu.com)》

==在天宽地广的旷野中，我们与新的自己相逢。==

||你知道的太多了。||

@Pingan[随机头像API](https://api.multiavatar.com/_随机数.png)

::: warning
warning
:::

::: error
error
:::

![11](https://bu.dusays.com/2024/10/02/66fd693ea4eab.jpg)

`)
const editorId = 'preview-only-notes'
const myModal = ref(null)
const isDark = computed(() => useColorMode().value == 'dark')
const router = useRouter()
const timeDifference = ref({
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
const testimonials = [
  {
    quote: '01年的小男孩，愿望是世界和平',
    name: '平安',
    designation: '平平安安，岁岁年年',
    image: 'https://q1.qlogo.cn/g?b=qq&nk=256260842&s=640'
  },
  {
    quote: '03的小女孩，愿望是世界和平',
    name: '粥粥',
    designation: '吃喝不愁，快乐自由',
    image: 'https://q1.qlogo.cn/g?b=qq&nk=1708215096&s=640'
  }
]
const gridItems = [
  {
    icon: 'lucide:box',
    title: '记录瞬间',
    description: '记录美好瞬间',
    url: '/photoAlbum'
  },
  {
    icon: 'lucide:settings',
    title: '点点滴滴',
    description: '我们的点点滴滴',
    url: '/articles'
  },
  {
    icon: 'lucide:music',
    title: '留言祝福',
    description: '书写你的留言祝福',
    url: '/leaveMessage'
  },
  {
    icon: 'lucide:sparkles',
    title: '标题四',
    description: '内容四',
    url: '/photoAlbum'
  }
]
const people = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Software Engineer',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80'
  },
  {
    id: 2,
    name: 'Robert Johnson',
    designation: 'Product Manager',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    name: 'Jane Smith',
    designation: 'Data Scientist',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'UX Designer',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 5,
    name: 'Tyler Durden',
    designation: 'Soap Developer',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80'
  },
  {
    id: 6,
    name: 'Dora',
    designation: 'The Explorer',
    image:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80'
  }
]
const reviews = [
  {
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: 'https://avatar.vercel.sh/jack'
  },
  {
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill'
  },
  {
    name: 'John',
    username: '@john',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/john'
  },
  {
    name: 'Jane',
    username: '@jane',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jane'
  },
  {
    name: 'Jenny',
    username: '@jenny',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jenny'
  },
  {
    name: 'James',
    username: '@james',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/james'
  }
]
const tags = ref([
  {
    icon: 'emojione:beating-heart',
    label: '拉拉扯扯一周年啦',
    time: '2024-12-17'
  },
  {
    icon: 'emojione:beating-heart',
    label: '第一次约会',
    time: '2023-11-26'
  },
  {
    icon: 'emojione:beating-heart',
    label: '第一次旅游',
    time: '2024-03-01'
  },
  {
    icon: 'emojione:beating-heart',
    label: '第一个100天',
    time: '2024-03-26'
  },
  {
    icon: 'emojione:beating-heart',
    label: '我们在一起了',
    time: '2023-12-17'
  },
  {
    icon: 'emojione:beating-heart',
    label: '已经异地',
    time: '2025-01-15'
  }
])
// 预定义颜色组合（Tailwind 颜色类名）
const colorClasses = ['#38bdf8', '#fca5a5', '#fb923c', '#65a30d', '#f9a8d4', '#fb923c']

// Split reviews into two rows
const firstRow = ref(reviews.slice(0, reviews.length / 2))
const secondRow = ref(reviews.slice(reviews.length / 2))

const html = ref('')

onMounted(async () => {
  const highlighter = await createHighlighter({
    langs: ['javascript', 'css', 'csharp'],
    themes: [
      {
        name: 'my-theme',
        settings: [
          {
            scope: ['comment'],
            settings: {
              // 使用 `rgb`、`hsl`、`hsla`，//
              // 或者任何你的渲染器支持的颜色。
              foreground: 'rgb(128, 128, 128)'
            }
          },
          {
            scope: ['string'],
            settings: {
              foreground: '#79b8ff' // CSS 变量
            }
          }
          // 更多
        ],
        // 背景和前景颜色
        bg: '#ff66661a',
        fg: '#005CC5'
      }
    ],
    lineOptions: [
      { line: 2, classes: ['highlighted-line'] }, // 高亮特定行
      { line: 3, color: '#FF000033' } // 直接指定行背景色
    ],
    meta: { inline: true } // 内联样式（无额外包裹标签）
  })

  html.value = highlighter.codeToHtml(
    ` import { createHighlighter } from 'shiki'
  
    // createHighlighter 是异步的，它会初始化高亮器
    // 并加载指定的语言和主题。
    const highlighter = await createHighlighter({
      themes: ['nord'],
      langs: ['javascript'],
    })
  
    // 然后你就可以同步地使用 highlighter.codeToHtml
    // 并使用你指定的其中一个主题和语言。
    const code = highlighter.codeToHtml('const a = 1', {
      lang: 'javascript',
      theme: 'nord'
    })
      `,
    {
      lang: 'javascript',
      theme: 'my-theme'
    }
  )

  timeDifference.value = calculateTimeDifference('2023-12-17 00:00:00')
  setInterval(() => {
    timeDifference.value = calculateTimeDifference('2023-12-17 00:00:00')
  }, 1000)
})

const calculateTimeDifference = (targetDateTime) => {
  // 将目标日期时间字符串转换为 Date 对象
  var targetDate = new Date(targetDateTime)
  // 获取当前时间
  var currentDate = new Date()

  // 计算时间差（毫秒）
  var timeDifference = currentDate.getTime() - targetDate.getTime()

  // 计算总天数差（取整）
  const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  // 计算年份差
  var years = currentDate.getFullYear() - targetDate.getFullYear()

  // 获取当前月份和目标日期的月份差
  var currentMonth = currentDate.getMonth()
  var targetMonth = targetDate.getMonth()
  var months = currentMonth - targetMonth

  // 如果月份差为负数，则年份差减1，并补上12个月
  if (months < 0) {
    years--
    months += 12
  }

  // 获取当前日期和目标日期的天数差
  var currentDay = currentDate.getDate()
  var targetDay = targetDate.getDate()
  var days = currentDay - targetDay

  // 如果天数差为负数，则月份差减1，并补上对应的天数
  if (days < 0) {
    months--
    // 获取上个月的总天数
    var lastMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0)
    days += lastMonthDate.getDate()
  }

  // 获取当前时间和目标时间的小时、分钟、秒差
  var hours = currentDate.getHours() - targetDate.getHours()
  var minutes = currentDate.getMinutes() - targetDate.getMinutes()
  var seconds = currentDate.getSeconds() - targetDate.getSeconds()

  // 处理负数情况
  if (seconds < 0) {
    minutes--
    seconds += 60
  }
  if (minutes < 0) {
    hours--
    minutes += 60
  }
  if (hours < 0) {
    days--
    hours += 24
  }

  return {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    totalDays: totalDays
  }
}
// 切换主体颜色（直接修改html的类）
const toggleTheme = () => {
  // myModal.value.open()
  const htmlElement = document.documentElement // 获取html元素
  htmlElement.classList.toggle('dark')
}
const jumpPage = (url) => {
  console.log(url)
  router.push(url)
}
const jumpDetails = () => {
  router.push(`/details/book`)
}
</script>

<style lang="css">
.my-theme {
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem;
  overflow: auto;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
}

@keyframes hand {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.flip-horizontal-bottom {
  -webkit-animation: flip-horizontal-bottom 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: flip-horizontal-bottom 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2025-5-27 11:16:19
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation flip-horizontal-bottom
 * ----------------------------------------
 */
@-webkit-keyframes flip-horizontal-bottom {
  0% {
    -webkit-transform: rotateX(-180deg);
    /* transform: rotateX(-180deg); */
  }
  100% {
    -webkit-transform: rotateX(0);
    /* transform: rotateX(0); */
  }
}
@keyframes flip-horizontal-bottom {
  0% {
    -webkit-transform: rotateX(-180deg);
    transform: rotateX(-180deg);
  }
  100% {
    -webkit-transform: rotateX(0);
    transform: rotateX(0);
  }
}
</style>
