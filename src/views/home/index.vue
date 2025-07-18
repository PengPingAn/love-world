<template>
  <!-- 全屏容器，支持纵向滚动布局 -->
  <div class="min-h-screen flex flex-col justify-between px-4 sm:px-8">
    <div
      style="
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <!-- 顶部文字 + 动画 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 items-center lg:gap-10 py-10">
        <div class="flex flex-col items-start text-center md:text-left">
          <!-- 第一段：大标题 -->
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold p-2 leading-tight"
            v-if="sloganList.length > 0"
          >
            <TextHighlight class="bg-gradient-to-r from-indigo-300 to-purple-300">
              {{ sloganList[0] }}
            </TextHighlight>
          </h1>

          <BlurReveal
            :delay="0.2"
            :duration="0.75"
            class="p-2"
            v-if="sloganList.length > 1"
          >
            <!-- 第二段：副标题 -->
            <h2
              class="text-2xl sm:text-4xl font-bold pb-2 relative text-[var(--font-color)] text-left"
            >
              {{ sloganList[1] }}
              <span class="absolute animate-[hand_2s_ease-in-out_infinite]">👋</span>
            </h2>

            <!-- 第三段：描述文字 -->
            <p
              class="text-base sm:text-xl text-[var(--font-color)]"
              v-if="sloganList.length > 2"
            >
              {{ sloganList[2] }}
            </p>
          </BlurReveal>
        </div>

        <div class="relative w-full">
          <AnimatedTestimonials :testimonials="testimonials" />
        </div>
      </div>

      <!-- 底部文案 -->
      <div
        class="flex flex-col items-center text-base sm:text-lg p-4 text-[var(--font-color)]"
      >
        <p>“{{ sayText }}”</p>
        <div class="bounce animate-[float_2s_ease-in-out_infinite] mt-2">
          <Icon icon="meteor-icons:angle-down" width="2rem"></Icon>
        </div>
      </div>
    </div>

    <!-- 卡片区 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-12">
      <Card :cardInfo="cardInfo" />
    </div>

    <!-- SafariCard + sparkles -->
    <div class="px-4 mt-4 mb-4">
      <SafariCard>
        <SparklesText
          ref="sparklesTextRef"
          text=""
          :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
          :sparkles-count="20"
          class="text-sm text-[var(--font-color)]"
        />
      </SafariCard>
    </div>

    <!-- 标签卡片区 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 m-4">
      <template v-for="(item, index) in tags" :key="item">
        <div class="flip-horizontal-bottom" v-scroll-animate>
          <TagCard :color="item.color" :icon="'emojione:beating-heart'">
            <div
              class="flex justify-between items-center font-serif text-white w-full justify-between"
            >
              <div class="text-base sm:text-2xl">{{ item.title }}</div>
              <div class="text-xs sm:text-sm sm:text-base flex flex-col text-right">
                <span>{{ item.time }}</span>
                <span>过了{{ calculateTimeDifference(item.time).totalDays }}天</span>
              </div>
            </div>
          </TagCard>
        </div>
      </template>
    </div>

    <div class="px-4 mt-4 mb-4">
      <SafariCard>
        <div
          class="flex w-full flex-row items-center p-4 cursor-pointer justify-start ml-[1rem] mr-[1rem]"
        >
          <AnimatedTooltip :items="people" :isOverflow="true" />
        </div>
      </SafariCard>
    </div>

    <!-- 底部头像滚动 -->
    <div
      class="m-4 relative flex flex-col items-center justify-center overflow-hidden bg-background p-4 md:shadow-xl rounded-lg"
    >
      <Marquee pause-on-hover class="[--duration:20s]">
        <ReviewCard v-for="review in firstRow" :key="review.username" v-bind="review" />
      </Marquee>

      <Marquee reverse pause-on-hover class="[--duration:20s]">
        <ReviewCard v-for="review in secondRow" :key="review.username" v-bind="review" />
      </Marquee>

      <!-- 渐变遮罩 -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
      ></div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
      ></div>
    </div>

    <!-- hover card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      <div v-for="item in articles" :key="item" @click="jumpDetails(item.id)">
        <HoverCard :article="item" :card="true" />
      </div>
    </div>

    <!-- modal -->
    <MyModal :title="'祝福留言'" ref="myModal" :lock-scroll="false">
      <div v-for="item in 100" :key="item" class="text-sm p-2">我是内容</div>
    </MyModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useColorMode } from "@vueuse/core";
import { codeToHtml, createHighlighter } from "shiki";
import { Icon, iconLoaded } from "@iconify/vue";
import { cn } from "@/lib/utils";
import MyModal from "@/components/my-ui/modal/MyModal.vue";
import { useRouter } from "vue-router";
import { MdEditor, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "md-editor-v3/lib/preview.css";
import Card from "./card.vue";
import { getConfig, getHomeArticles } from "@/api/home";

const myModal = ref(null);
const isDark = computed(() => useColorMode().value == "dark");
const router = useRouter();
const timeDifference = ref({
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});
const testimonials = ref([
  {
    intro: "01年的小男孩，愿望是世界和平",
    nikeName: "平安",
    signature: "平平安安，岁岁年年",
    imgUrl: "https://q1.qlogo.cn/g?b=qq&nk=256260842&s=640",
  },
  {
    intro: "03的小女孩，愿望是世界和平",
    nikeName: "粥粥",
    signature: "吃喝不愁，快乐自由",
    imgUrl: "https://q1.qlogo.cn/g?b=qq&nk=1708215096&s=640",
  },
]);
const sparklesTextRef = ref(null);
const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];
const tags = ref([]);
const sloganList = ref([]);
const sayText = ref("");
const cardInfo = ref([]);
const articles = ref([]);
// 预定义颜色组合（Tailwind 颜色类名）
const colorClasses = ["#38bdf8", "#fca5a5", "#fb923c", "#65a30d", "#f9a8d4", "#fb923c"];

// Split reviews into two rows
const firstRow = ref(reviews.slice(0, reviews.length / 2));
const secondRow = ref(reviews.slice(reviews.length / 2));

const html = ref("");

onMounted(async () => {
  timeDifference.value = calculateTimeDifference("2023-12-17 00:00:00");
  setInterval(() => {
    timeDifference.value = calculateTimeDifference("2023-12-17 00:00:00");
  }, 1000);

  getConfig({ key: "web.home.config" }).then((res) => {
    if (res.code === 200) {
      let data = JSON.parse(res.data);
      sloganList.value = data.sloganList;
      testimonials.value = data.weInfo;
      sayText.value = data.say;
      cardInfo.value = data.cardInfo;
      sparklesTextRef.value.init(data.startTime);
    }
  });
  getConfig({ key: "web.home.tags" }).then((res) => {
    if (res.code === 200) {
      let data = JSON.parse(res.data);
      console.log(data);
      tags.value = data;
    }
  });

  getHomeArticles().then((res) => {
    console.log(res);
    if (res.code == 200) articles.value = res.data;
  });
});

const calculateTimeDifference = (targetDateTime) => {
  // 将目标日期时间字符串转换为 Date 对象
  var targetDate = new Date(targetDateTime);
  // 获取当前时间
  var currentDate = new Date();

  // 计算时间差（毫秒）
  var timeDifference = currentDate.getTime() - targetDate.getTime();

  // 计算总天数差（取整）
  const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // 计算年份差
  var years = currentDate.getFullYear() - targetDate.getFullYear();

  // 获取当前月份和目标日期的月份差
  var currentMonth = currentDate.getMonth();
  var targetMonth = targetDate.getMonth();
  var months = currentMonth - targetMonth;

  // 如果月份差为负数，则年份差减1，并补上12个月
  if (months < 0) {
    years--;
    months += 12;
  }

  // 获取当前日期和目标日期的天数差
  var currentDay = currentDate.getDate();
  var targetDay = targetDate.getDate();
  var days = currentDay - targetDay;

  // 如果天数差为负数，则月份差减1，并补上对应的天数
  if (days < 0) {
    months--;
    // 获取上个月的总天数
    var lastMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += lastMonthDate.getDate();
  }

  // 获取当前时间和目标时间的小时、分钟、秒差
  var hours = currentDate.getHours() - targetDate.getHours();
  var minutes = currentDate.getMinutes() - targetDate.getMinutes();
  var seconds = currentDate.getSeconds() - targetDate.getSeconds();

  // 处理负数情况
  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--;
    hours += 24;
  }

  return {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    totalDays: totalDays,
  };
};

const jumpDetails = (id) => {
  router.push({
    path: "/details/book",
    query: { id: id },
  });
};
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
  -webkit-animation: flip-horizontal-bottom 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    both;
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
