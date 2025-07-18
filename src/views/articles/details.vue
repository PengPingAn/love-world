<template>
  <div
    class="m-[5rem] max-w-[1100px] m-auto text-[var(--font-color)]"
    style="font-family: 'Noto Serif SC', serif"
  >
    <div class="text-center mb-[4rem]">
      <h1 class="text-4xl font-bold">{{ articleInfo.title }}</h1>
      <div
        class="flex flex-wrap justify-center items-center text-sm mt-8 text-gray-600 gap-x-4 gap-y-2"
        style="color: var(--font-color)"
      >
        <span class="flex items-center gap-1">
          <Icon icon="hugeicons:date-time" />
          {{ articleInfo.createTime }}{{ articleInfo.lastUpdateTime ? "(已编辑)" : "" }}
        </span>
        <span class="flex items-center gap-1">
          <Icon icon="streamline-freehand:view-eye-1" />
          {{ articleInfo.browse }}
        </span>
        <span class="flex items-center gap-1">
          <Icon icon="streamline-freehand:time-clock-circle" />
          预计阅读时长：{{ readingTime }}分钟
        </span>
      </div>
    </div>
    <div
      class="grid grid-cols-[auto_150px] [@media(max-width:1200px)]:grid-cols-none gap-14"
    >
      <div class="max-w-[1000px]" style="max-width: 100%; overflow-x: auto">
        <div ref="componentRef">
          <MdPreview
            previewTheme="github"
            :editorId="editorId"
            :modelValue="articleInfo.content"
            style="
              background: transparent;
              min-height: 90vh;
              font-family: 'Noto Serif SC', serif;
            "
            @onGetCatalog="onGetCatalog"
            :theme="userStore.$state.editorTheme"
          />
        </div>
        <div
          class="m-auto max-w-[1000px] pt-[5rem]"
          style="max-width: 100%; overflow-x: auto"
        >
          <LeaveMessageForm @submit="submit" />
          <br />
          <div>
            <!-- 骨架屏 -->
            <transition name="fade">
              <div v-if="loading" class="skeletons">
                <SkeletonLoader v-for="i in 3" :key="i" type="comments" />
              </div>
            </transition>
            <Comment :data="commentData" :isReply="true" @submit="submit" />
            <!-- 触发器锚点 -->
            <div ref="sentinel" class="sentinel" v-if="!finished"></div>
          </div>

          <!-- <LeaveMessageForm @submit="submit" />
          <SkeletonLoader :type="'comments'" />
          <br />
          <Comment :data="commentData" :isReply="true" @submit="submit" /> -->
        </div>
      </div>
      <div style="position: relative">
        <div
          style="max-width: 10rem"
          :style="{
            position: marginTop == 0 ? 'fixed' : '',
            marginTop: marginTop != 0 ? '6rem' : '0',
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
            <Like @btnLike="btnLike" :isLike="liked"></Like>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="gradient-bg"></div>

  <div>
    <div class="flex gap-4 mb-4">
      <div class="h-auto w-[2px] bg-[#e16060]"></div>
      <span class="font-bold text-xl"
        >2025
        <span class="text-xs text-[#646464]"> （{{ timelineData.length }}） </span></span
      >
    </div>
    <div v-for="(item, index) in timelineData" :key="index" class="flex gap-4 relative">
      <!-- 圆点容器，添加连接线伪元素 -->
      <div
        class="relative flex items-center justify-center"
        :class="[
          index !== 0 ? 'before-line' : '',
          index !== timelineData.length - 1 ? 'after-line' : '',
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
  </div>
</template>

<script setup lang="ts">
import { MdCatalog, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "md-editor-v3/lib/preview.css";
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { useEditorThemeStore } from "@/stores/pinia";
import MarkdownIt from "markdown-it";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { getArticle } from "@/api/home";
import { addBrowse, articleLike, hasLike, getComment, pushComment } from "@/api/article";

const md = new MarkdownIt();
const userStore = useEditorThemeStore();
const editorId = "preview-only-notes";
const scrollElement = document.documentElement;
const readingTime = ref(0);

const marginTop = ref(220);
const titles = ref([]);
const scrollPercentage = ref<Number>(0);
const componentRef = ref(null); // 组件根元素的引用
const timelineData = ref([
  {
    time: "02/05",
    title: "镜头与代码的交响：打造个人线上画廊与假期随笔",
    tag: "心情：开心 / 天气：阴 / 手记",
  },
  {
    time: "02/05",
    title: "镜头与代码的交响：打造个人线上画廊与假期随笔",
    tag: "心情：开心 / 天气：阴 / 手记",
  },
  {
    time: "02/05",
    title: "镜头与代码的交响：打造个人线上画廊与假期随笔",
    tag: "心情：开心 / 天气：阴 / 手记",
  },
]);
const commentData = ref([
  // {
  //   id: 1,
  //   nickName: "张杰",
  //   content: "==祝你们百年好合==",
  //   webSite: "https://baidu.com",
  //   imgUrl:
  //     "https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
  //   time: "大约2小时前",
  //   children: [
  //     {
  //       id: 11,
  //       nickName: "灵动",
  //       replyName: "张杰",
  //       content: "我回复一下",
  //       webSite: "",
  //       imgUrl:
  //         "https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
  //       time: "大约2小时前",
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   nickName: "热心市民",
  //   content: "在爱的旅途中 坚守初心 一路相伴同行 祝福你们爱情长长久久",
  //   webSite: "",
  //   imgUrl:
  //     "https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
  //   time: "大约3小时前",
  //   children: [],
  // },
  // {
  //   id: 3,
  //   nickName: "小石头",
  //   content: "你们的爱如阳光遍洒 使生活处处充满温暖 祝福长长久久",
  //   webSite: "",
  //   imgUrl:
  //     "https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
  //   time: "大约8小时前",
  //   children: [],
  // },
  // {
  //   id: 4,
  //   nickName: "消炎",
  //   content: "愿君与卿情长久 朝朝暮暮共欢颜",
  //   webSite: "",
  //   imgUrl:
  //     "https://img2.baidu.com/it/u=3652024792,1312709718&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
  //   time: "大约1天前",
  //   children: [],
  // },
]);
const route = useRoute();
const articleInfo = ref<any | null>({
  id: "",
  title: "",
  isPrivate: false,
  content: "",
  browse: 0,
  like: 0,
  isTop: false,
  lastUpdateTime: "",
  createTime: "",
});
const liked = ref(false);
const loading = ref(false);
const finished = ref(false);
const sentinel = ref(null);

let observer = null;
let articleId = "";
let lastScrollTop = 0;
let sidebarTop = false;
let sidebarOffset = false;
const handleScroll = () => {
  const currentScrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
  if (currentScrollTop > lastScrollTop) {
    // 获取页面滚动的位置与页面总高度
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY >= 220 && !sidebarTop) {
      marginTop.value = 0;
      sidebarTop = true;
      sidebarOffset = false;
    }
  } else {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY <= 220 && !sidebarOffset) {
      marginTop.value = 220;
      sidebarTop = false;
      sidebarOffset = true;
    }
  }
  lastScrollTop = currentScrollTop;
};
const onGetCatalog = (list: any) => {
  titles.value = list;
};
const onActive = (heading: any, e: any) => {
  setTimeout(() => {
    e.scrollIntoView({
      behavior: "smooth", // 平滑滚动
      block: "nearest", // 对齐到顶部 (可选: start/center/end/nearest)
    });
  }, 100);
};

const calculateScrollPercentage = () => {
  if (!componentRef.value) return;

  const component = componentRef.value;
  const componentRect = component.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const componentHeight = componentRect.height;

  // 计算组件在视口中的可见部分
  const visibleStart = Math.max(0, -componentRect.top);
  const visibleEnd = Math.min(componentHeight, windowHeight - componentRect.top);
  const visibleHeight = Math.max(0, visibleEnd - visibleStart);

  // 计算滚动百分比 (0% = 组件顶部刚进入视口，100% = 组件底部刚离开视口)
  scrollPercentage.value = Math.min(
    100,
    Math.round((visibleStart / (componentHeight - visibleHeight)) * 100)
  );
};
const submit = (val, id = null, replyId = null, replyName = null) => {
  const newComment = {
    id: articleId,
    nickName: val.nickName,
    content: val.content,
    webSite: val.webSite,
    email: val.email,
    replyId: replyId,
  };
  pushComment(newComment).then((res) => {
    if (res.code === 200) {
      window.$message.success("你已成功评论");

      const comment = {
        id: res.data.id,
        nickName: newComment.nickName,
        replyName: replyName,
        content: newComment.content,
        webSite: newComment.webSite,
        imgUrl: res.data.imgUrl,
        time: "刚刚",
        children: [],
      };
      if (id) {
        let data = findAnyCommentById(id);
        // 更新评论的 children 数据
        if (data) {
          data.children.push(comment);
        }
      } else {
        // 更新主评论数据
        commentData.value.unshift(comment);
      }
    }
  });
};

const findAnyCommentById = (id) => {
  for (const comment of commentData.value) {
    if (comment.id === id) {
      return comment;
    }
    const child = comment.children.find((child) => child.id === id);
    if (child) {
      return child;
    }
  }
  return null;
};

const estimateReadingTime = (text: string, wordsPerMinute = 300): number => {
  // 1. 转为 HTML
  const html = md.render(text);

  // 2. 去掉 HTML 标签，得到纯文本
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, "");

  // 3. 统计文本长度（中文字符为主）
  const length = plainText.trim().length;

  // 4. 计算阅读时间
  return Math.max(1, Math.ceil(length / wordsPerMinute));
};

const btnLike = () => {
  articleLike(articleId).then((res) => {
    if (res.code === 200) {
      liked.value = true;
      if (res.data) {
        window.$message.success("谢谢你的点赞");
      } else {
        window.$message.info("你已经点过赞啦！！！");
      }
    }
  });
};
const loadMore = () => {
  if (loading.value || finished.value) return;
  loading.value = true;

  // ✅ 暂时断开监听，防止重复触发
  observer?.unobserve(sentinel.value);

  getComment({ type: 1, id: articleId })
    .then((res) => {
      loading.value = true;
      if (res.code === 200) {
        commentData.value = res.data;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

onMounted(async () => {
  window.loading.open({
    isFull: true,
    isMaxHeight: true,
  });

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("scroll", calculateScrollPercentage);

  const id = route.query.id;
  if (id) {
    articleId = id;

    await addBrowse({ id }); // 等待计入浏览量

    const articleRes = await getArticle({ id });
    if (articleRes.code === 200) {
      articleInfo.value = articleRes.data;
      readingTime.value = estimateReadingTime(articleInfo.value.content);

      const likeRes = await hasLike({ id });
      if (likeRes.code === 200) {
        liked.value = likeRes.data;
        console.log(liked.value);
      }

      window.loading.close();
    }
  }

  loadMore();

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !loading.value && !finished.value) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    }
  );

  await nextTick();
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onBeforeUnmount(() => {});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("scroll", calculateScrollPercentage);
  observer?.disconnect();
});
</script>

<style lang="scss" scoped>
.p-side {
  overflow-y: auto;
  top: 122px;
  height: 100%;
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
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0) 10%,
    rgba(255, 105, 180, 0.2) 100%
  );
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
  content: "";
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
  content: "";
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

.sentinel {
  height: 1px;
  margin-top: 2rem;
}
</style>
