<template>
  <div class="m-[5rem] max-w-[1100px] m-auto" style="font-family: 'Noto Serif SC', serif">
    <div class="text-center mb-[4rem]">
      <h1 class="text-4xl font-bold">文章标题</h1>
    </div>
    <div class="grid grid-cols-[auto_150px] [@media(max-width:1200px)]:grid-cols-none gap-14">
      <div class="max-w-[1000px]">
        <div ref="componentRef">
          <MdPreview
            previewTheme="github"
            :editorId="editorId"
            :modelValue="content"
            style="background: transparent; min-height: 90vh; font-family: 'Noto Serif SC', serif"
            @onGetCatalog="onGetCatalog"
          />
        </div>
        <div class="m-auto max-w-[1000px] pt-[5rem]">
          <LeaveMessageForm @submit="submit" />
          <SkeletonLoader :type="'comments'" />
          <Comment :data="commentData" :isReply="true" @submit="submit" />
        </div>
      </div>
      <div style="position: relative">
        <div
          style="max-width: 10rem"
          :style="{
            position: marginTop == 0 ? 'fixed' : '',
            marginTop: marginTop != 0 ? '6rem' : '0'
          }"
          class="p-side"
        >
          <MdCatalog
            class="p-side-c"
            :editorId="editorId"
            :scrollElement="scrollElement"
            :scrollElementOffsetTop="70"
            :offsetTop="200"
            @onActive="onActive"
          />
          <div class="h-px border border-[#dedede] m-[5px]"></div>
          <div class="flex items-center gap-2 m-[5px]">
            <AnimatedCircularProgressBar
              :max="100"
              :min="0"
              :value="scrollPercentage"
              :class="'bar'"
              :showPercentage="false"
              :circleStrokeWidth="13"
              :gaugePrimaryColor="'#acacac'"
            />
            <span style="color: #aeafaf; font-size: 15px">{{ scrollPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="m-auto max-w-[1000px] p-[5rem]">
    <LeaveMessageForm @submit="submit" />
    <SkeletonLoader :type="'comments'" />
    <Comment :data="commentData" :isReply="true" @submit="submit" />
  </div> -->
  <div class="gradient-bg"></div>

  <div>
    <div class="flex gap-4 mb-4">
      <div class="h-auto w-[2px] bg-[#e16060]"></div>
      <span class="font-bold text-xl"
        >2025 <span class="text-xs text-[#646464]"> （{{ timelineData.length }}） </span></span
      >
    </div>
    <div v-for="(item, index) in timelineData" :key="index" class="flex gap-4 relative">
      <!-- 圆点容器，添加连接线伪元素 -->
      <div
        class="relative flex items-center justify-center"
        :class="[
          index !== 0 ? 'before-line' : '',
          index !== timelineData.length - 1 ? 'after-line' : ''
        ]"
      >
        <div class="w-2 h-2 bg-gray-700 rounded-full z-10"></div>
      </div>

      <!-- 内容 -->
      <div
        class="flex justify-between w-full border-b border-gray-200 items-center text-[15px] text-[#646464] leading-8"
      >
        <div class="flex gap-4 items-center cursor-pointer">
          <div class="text-sm text-gray-500">{{ item.time }}</div>
          <div class="title-hover">{{ item.title }}</div>
        </div>
        <div class="text-sm text-gray-500 flex gap-2 items-center">
          <span>心情：{{ item.mood }}</span> / <span>天气：{{ item.weather }}</span> /
          <span>{{ item.type }}</span>
        </div>
      </div>
    </div>

    <!-- <iframe 
      src="/static/z.html" 
      frameborder="0"
      style="width: 100%; height: 500px;"
    ></iframe> -->
  </div>
</template>


<script setup lang="ts">
import { MdCatalog, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import 'md-editor-v3/lib/preview.css'
import { onMounted, onUnmounted, ref } from 'vue'

const editorId = 'preview-only-notes'
const scrollElement = document.documentElement
const content = ref(`
## # 生命的旷野
- 你好
==落||日西沉||，炊烟袅袅。==

@linkCard[标题][https://q2.itc.cn/q_70/images03/20241013/6fe9a539a055473b8677c734558b462f.jpeg][这是一个描述](https://icon-sets.iconify.design/?query=link&search-page=1)

:::collapse title=点我展开内容
==春风若有怜花意，可否许我再少年？==

> *“人间浮躁，尘世喧嚣。不曾想过去桃花源与世界隔绝的人间圣地，只想拥有一片属于自己的宁境。 不曾去过森林，却想在森林中聆听大自然的声音，享受这一片宁静。”*

- 列表
:::

:::carousel
https://ss3.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/18d8bc3eb13533fae0a4ef61acd3fd1f41345b6a.jpg
https://pic4.zhimg.com/v2-57ed22547faf8635adb245964aee8a0b_r.jpg
https://www.2008php.com/2013_Website_appreciate/2013-03-17/20130317005445.jpg
https://p7.itc.cn/q_70/images03/20240101/469a5b2a96a346318d190fd0acfe20c3.jpeg
https://pic1.zhimg.com/80/v2-2464893e23ed8c3d2760b446015ef8e8_r.jpg
:::

村里的环境==恬静==而舒适，深秋的风凉爽而不凛冽。@Pingan[此间别处](https://baidu.com)铁栅栏里是一条不长不短的小径，通往一座矮矮的房子。小径边上有一座小假山和一个小水塘，尚且算作修饰。在小屋的后面可以隐约看见远远的旷野。这是一片广阔之境。

坐在小方桌旁，等待饭菜上桌。夹起一口喷香出锅的鸡，配一瓶可乐，一群人围成一顿简单而丰满的晚餐。

夜幕降临，华灯初上。徘徊于小路边，看明亮的小屋，看轮廓模糊的假山，看路旁的小灯发出的点点微光……抬眼，城市里难以见到的点点繁星次第铺展；烟花绽放，破旧的瓦房洒下了昏黄的灯光。再将视野放远，便又是那片若隐若现的旷野。

几个人，一张桌子，一个小院……生命不再困在一个小小的城市里，||而是去面对乡下的广阔天地||。

不知出于什么想法，这里的一切使我内心有种自由之感，不能说太强烈，但是存在。我意识到我在某种程度上触及到了被繁重生活所蒙蔽的内心深处的快乐与自由。

我说城里人啊，别局限在那狭窄的格子里，去看看外面的世界吧。活着不仅仅是为了==“谋生”==，更是为了遵从内心的自由，听那栅栏门前的声声犬吠，看那旷野之上的点点繁星，探索那摆脱纷繁复杂的纯洁的别样世界。人常言“生命如旷野”，人的内心本来就是一片旷野，只是现实逼迫我们用些所谓的正确去将那本属于我们的纯真隐匿起来罢了。所以请坚信，只要你愿意去探索，去创造，那片独属于你的苍茫旷野必定会得到解脱，热烈而奔放。

>此间别处也一样奔忙，只是他们脚步声里多了些天宽地广。——毛不易《@Pingan[此间别处](https://baidu.com)》

==在天宽地广的旷野中，我们与新的自己相逢。==

:::video src=https://www.youtube.com/embed/dQw4w9WgXcQ
这是一个油管视频
::: 

||你知道的太多了。||

@Pingan[随机头像API](https://api.multiavatar.com/_随机数.png)

::: warning
warning
:::

::: error
error
:::

![11](https://bu.dusays.com/2024/10/02/66fd693ea4eab.jpg)

==说到健康作息，还真是要好好总结一下，都说程序员这一行，猝死概率极高，究其原因还是很难有很好的作息规律。这里就带来“传说中”的“世界上最健康的作息时间表”，随时提醒自己吧，毕竟身体可是自己的哦。==

## **7:30**

**起床**：英国威斯敏斯特大学的研究人员发现，那些在早上5:22-7:21分起床的人，其血液中有一种能引起心脏病的物质含量较高，因此，在7:21之后起床对身体健康更加有益。

打开台灯：“一醒来，就将灯打开，这样将会重新调整体内的生物钟，调整睡眠和醒来模式。”拉夫堡大学睡眠研究中心教授吉姆·霍恩说。喝一杯水：水是身体内成千上万化学反应得以进行的必需物质。早上喝一杯清水，可以补充晚上的缺水状态。

## **7:30-8:00**

**在早饭之前刷牙**：“在早饭之前刷牙可以防止牙齿的腐蚀，因为刷牙之后，可以在牙齿外面涂上一层含氟的保护层。要么，就等早饭之后半小时再刷牙。”英国牙齿协会健康和安全研究人员戈登·沃特金斯说。

## **8:00-8:30**

**吃早饭**：“早饭必须吃，因为它可以帮助你维持血糖水平的稳定。”伦敦大学国王学院营养师凯文·威尔伦说。早饭可以吃燕麦粥等，这类食物具有较低的血糖指数。

## **8:30-9:00**

**避免运动**：来自布鲁奈尔大学的研究人员发现，在早晨进行锻炼的运动员更容易感染疾病，因为免疫系统在这个时间的功能最弱。

**步行上班**：马萨诸塞州大学医学院的研究人员发现，每天走路的人，比那些久坐不运动的人患感冒病的概率低25%。

## **9:30**

**开始一天中最困难的工作**：纽约睡眠中心的研究人员发现，大部分人在每天醒来的一两个小时内头脑最清醒。

## **10:30**

**让眼睛离开屏幕休息一下**：如果你使用电脑工作，那么每工作一小时，就让眼睛休息3分钟。

## **11:00**

**吃点水果**：这是一种解决身体血糖下降的好方法。吃一个橙子或一些红色水果，这样做能同时补充体内的铁含量和维生素C含量。

## **13:00**

**在面上加一些豆类蔬菜**：你需要一顿可口的午餐，并且能够缓慢地释放能量。“烘烤的豆类食品富含纤维素，番茄酱可以当作是蔬菜的一部分。”维伦博士说。

## **14:30-15:30**

**午休一小会儿**：雅典的一所大学研究发现，那些每天中午午休30分钟或更长时间，每周至少午休3次的人，因心脏病死亡的概率会下降37%。

## **16:00**

**喝杯酸奶**：这样做可以稳定血糖水平。在每天三餐之间喝些酸牛奶，有利于心脏健康。

## **17:00-19:00**

**锻炼身体**：根据体内的生物钟，这个时间是运动的最佳时间，舍菲尔德大学运动学医生瑞沃·尼克说。

## **19:30**

**晚餐少吃点**：晚饭吃太多，会引起血糖升高，并增加消化系统的负担，影响睡眠。晚饭应该多吃蔬菜，少吃富含卡路里和蛋白质的食物。吃饭时要细嚼慢咽。

## **21:45**

**看会电视**：这个时间看会儿电视放松一下，有助于睡眠，但要注意，尽量不要躺在床上看电视，这会影响睡眠质量。

## **23:00**

**洗个热水澡**：“体温的适当降低有助于放松和睡眠。”拉夫堡大学睡眠研究中心吉姆·霍恩教授说。

## **23:30**

**上床睡觉**：如果你早上7点30起床，现在入睡可以保证你享受8小时充足的睡眠。



## **时间、健康的小常识11111111111**



要知道，任何试图更改生物钟的行为，都将给身体留下莫名其妙的疾病，等到20、30年之后再后悔，已经来不及了。下面再补充一些和时间、健康有关的小常识，继续供大家参考：

1. 晚上9-11点为免疫系统（淋巴）排毒时间，此段时间应安静或听音乐。
2. 晚间11-凌晨1点，肝的排毒，需在熟睡中进行。
3. 凌晨1-3点，胆的排毒，亦同。
4. 凌晨3-5点，肺的排毒。此即为何咳嗽的人在这段时间咳得最剧烈，因排毒动作已走到肺；不应用止咳药，以免抑制废积物的排除。
5. 凌晨5-7点，大肠的排毒，应上厕所排便。
6. 凌晨7-9点，小肠大量吸收营养的时段，应吃早餐。疗病者最好早吃，在6点半前，养生者在7点半前，不吃早餐者应改变习惯，即使拖到9、10点吃都比不吃好。
7. 半夜至凌晨4点为脊椎造血时段，必须熟睡，不宜熬夜。

`)
const marginTop = ref(220)
const titles = ref([])
const scrollPercentage = ref<Number>(0)
const componentRef = ref(null) // 组件根元素的引用
const timelineData = ref([
  {
    time: '02/05',
    title: '镜头与代码的交响：打造个人线上画廊与假期随笔',
    tag: '心情：开心 / 天气：阴 / 手记'
  },
  {
    time: '02/05',
    title: '镜头与代码的交响：打造个人线上画廊与假期随笔',
    tag: '心情：开心 / 天气：阴 / 手记'
  },
  {
    time: '02/05',
    title: '镜头与代码的交响：打造个人线上画廊与假期随笔',
    tag: '心情：开心 / 天气：阴 / 手记'
  }
])
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

let lastScrollTop = 0
let sidebarTop = false
let sidebarOffset = false
const handleScroll = () => {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  if (currentScrollTop > lastScrollTop) {
    // 获取页面滚动的位置与页面总高度
    const scrollY = window.scrollY || window.pageYOffset

    if (scrollY >= 220 && !sidebarTop) {
      marginTop.value = 0
      sidebarTop = true
      sidebarOffset = false
    }
  } else {
    const scrollY = window.scrollY || window.pageYOffset
    if (scrollY <= 220 && !sidebarOffset) {
      marginTop.value = 220
      sidebarTop = false
      sidebarOffset = true
    }
  }
  lastScrollTop = currentScrollTop
}
const onGetCatalog = (list: any) => {
  titles.value = list
}
const onActive = (heading: any, e: any) => {
  setTimeout(() => {
    e.scrollIntoView({
      behavior: 'smooth', // 平滑滚动
      block: 'nearest' // 对齐到顶部 (可选: start/center/end/nearest)
    })
  }, 100)
}

const calculateScrollPercentage = () => {
  if (!componentRef.value) return

  const component = componentRef.value
  const componentRect = component.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const componentHeight = componentRect.height

  // 计算组件在视口中的可见部分
  const visibleStart = Math.max(0, -componentRect.top)
  const visibleEnd = Math.min(componentHeight, windowHeight - componentRect.top)
  const visibleHeight = Math.max(0, visibleEnd - visibleStart)

  // 计算滚动百分比 (0% = 组件顶部刚进入视口，100% = 组件底部刚离开视口)
  scrollPercentage.value = Math.min(
    100,
    Math.round((visibleStart / (componentHeight - visibleHeight)) * 100)
  )
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', calculateScrollPercentage)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', calculateScrollPercentage)
})
</script>

<style lang="scss" scoped>
.p-side {
  overflow-y: auto;
  top: 122px;
  &-c {
    max-width: 10rem;
    max-height: 20vh;
    overflow-y: auto;
    position: relative;
    &::-webkit-scrollbar {
      display: none !important; /* 隐藏滚动条 */
    }
  }
  @media screen and (max-width: 1200px) {
    display: none;
  }
}
.bar {
  width: 1rem;
  height: 1rem;
}
.gradient-bg {
  background: linear-gradient(to top, rgba(255, 255, 255, 0) 10%, rgba(255, 105, 180, 0.2) 100%);
  width: 100%;
  position: absolute;
  height: 600px;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

.point {
  width: 0.5rem;
  height: 0.5rem;
  background: #656668;
  border-radius: 50%;
}
.before-line::before,
.after-line::after {
  content: '';
  position: absolute;
  width: 1px;
  background-color: #d1d5db; /* gray-300 */
  left: 50%;
  transform: translateX(-50%);
}
.before-line::before {
  top: 0;
  bottom: 50%;
}
.after-line::after {
  top: 50%;
  bottom: 0;
}

.title-hover {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.title-hover::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 5px; /* 贴紧文字 */
  width: 100%;
  height: 1px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.title-hover:hover::after {
  transform: scaleX(1);
}
</style>
