<template>
  <div class="layout">
    <div
      class="danmu-container"
      :style="{ backgroundImage: 'url(' + bgImgList[0] + ')' }"
    >
      <div
        v-for="(danmu, index) in danmus"
        :key="index"
        class="danmu"
        :style="{
          top: `${danmu.top}px`,
          color: danmu.color,
          animationDelay: `${danmu.seconds}s`,
          animation: `solutionMove ${danmu.seconds2}s linear infinite`,
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
      <br />
      <div>
        <Comment :data="commentData" :isReply="false" @submit="submit" />
        <!-- 骨架屏 -->
        <transition name="fade">
          <div v-if="loading" class="skeletons">
            <SkeletonLoader v-for="i in 3" :key="i" type="comments" />
          </div>
        </transition>
        <div
          v-if="finished && !loading && commentData.length > 0"
          style="margin: 1rem; text-align: center; color: #828282"
        >
          (｡･ω･｡)ﾉ♡ 已经到底啦！
        </div>
        <div v-if="commentData.length === 0">⌜ 此处无声胜有声</div>

        <!-- 触发器锚点 -->
        <div ref="sentinel" class="sentinel" v-if="!finished"></div>
      </div>
    </div>
    <Foot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, nextTick } from "vue";
import Foot from "@/views/foot/index.vue";
import { addComment, getCommentByType } from "@/api/comment";

const danmus = ref<any>([]);
const sendMessage = ref();
const isLeave = ref(false);
const myDiv = ref<any>(null);
const imgIndex = ref(0);
const bgImgList = ref(["/src/assets/message-bgimg.png"]);
const myInput = ref();
const commentData = ref([]);
const sentinel = ref(null);
const loading = ref(false);
const finished = ref(false);
let observer = null;

const loadMore = async () => {
  if (loading.value || finished.value) return;

  loading.value = true;
  observer?.unobserve(sentinel.value); // 暂停监听，防止重复触发

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await getCommentByType({
      type: 2,
      offset: commentData.value.length,
    });

    if (res.code === 200) {
      const list = res.data;

      if (!list || list.length === 0) {
        finished.value = true;
        return;
      }

      list.forEach((e) => {
        const top = generateUniqueRandomNumber();
        const randomNumber = Math.floor(Math.random() * 2);
        const randomNumber2 = Math.floor(Math.random() * 30) + 10;

        danmus.value.push({
          top,
          content: e.content,
          color: "red",
          seconds: 0,
          seconds2: randomNumber2,
          imgIndex: randomNumber,
          bgColor: "#8e5b19ba",
          imgUrl: e.imgUrl,
        });

        commentData.value.push(e);
      });
    }
  } catch (error) {
    console.error("加载评论失败：", error);
  } finally {
    loading.value = false;
    // 加载完成后重新监听
    nextTick(() => {
      if (!finished.value && sentinel.value) {
        observer?.observe(sentinel.value);
      }
    });
  }
};
const getAllMore = async () => {
  try {
    const res = await getCommentByType({
      type: 2,
      offset: commentData.value.length,
      isAll: true,
    });

    if (res.code === 200) {
      const list = res.data;

      if (!list || list.length === 0) {
        finished.value = true;
        return;
      }

      list.forEach((e) => {
        const top = generateUniqueRandomNumber();
        const randomNumber = Math.floor(Math.random() * 2);
        const randomNumber2 = Math.floor(Math.random() * 30) + 10;

        danmus.value.push({
          top,
          content: e.content,
          color: "red",
          seconds: 0,
          seconds2: randomNumber2,
          imgIndex: randomNumber,
          bgColor: "#8e5b19ba",
          imgUrl: e.imgUrl,
        });
      });
    }
  } catch (error) {
    console.error("加载评论失败：", error);
  }
};

onMounted(async () => {
  imgIndex.value = Math.floor(Math.random() * 4);

  getAllMore();
  loadMore();

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !loading.value && !finished.value) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: "0px", // ⭐ 提前 200px 加载，提高体验
      threshold: 1,
    }
  );

  nextTick(() => {
    if (sentinel.value) {
      observer.observe(sentinel.value);
    }
  });
});
onUnmounted(() => {
  observer?.disconnect();
});

const btnSendMessage = (content, imgUrl) => {
  const top = generateUniqueRandomNumber();
  const randomNumber = Math.floor(Math.random() * 2); // 生成1到10之间的随机整数
  const randomNumber2 = Math.floor(Math.random() * 30) + 10;
  danmus.value.push({
    top,
    content: content,
    color: "red",
    seconds: 0,
    seconds2: randomNumber2,
    imgIndex: randomNumber,
    bgColor: "#198e28ba",
    imgUrl: imgUrl,
  });
  sendMessage.value = null;
};
const btnShow = () => {
  isLeave.value = true;
  myDiv.value.style.opacity = 1;
  setTimeout(() => {
    myInput.value?.focus();
  }, 500);
};
const submit = (val, id = null, replyName = null) => {
  const newComment = {
    nickName: val.nickName,
    content: val.content,
    webSite: val.webSite,
    email: val.email,
    type: 2,
    isAnonymous: false,
  };
  addComment(newComment).then((res) => {
    if (res.code === 200) {
      window.$message.success("你已成功评论");

      const comment = {
        id: res.data.id,
        nickName: newComment.nickName,
        content: newComment.content,
        webSite: newComment.webSite,
        imgUrl: res.data.imgUrl,
        time: "刚刚",
        children: [],
      };

      // 更新主评论数据
      commentData.value.unshift(comment);
    }
  });

  btnSendMessage(val.content, imgUrl);
};

const removeDanmu = (index) => {
  // danmus.value.splice(index, 1); // 从弹幕数组中移除对应的弹幕数据
};
// 获取屏幕高度
var screenHeight = window.innerHeight - 150;

// 用于存储已生成的随机数
var generatedNumbers = <any>[];

// 生成不重复的随机数函数
function generateUniqueRandomNumber() {
  var randomNumber;
  do {
    // 生成随机数，不超过屏幕高度
    randomNumber = Math.floor(Math.random() * screenHeight) + 110;
  } while (generatedNumbers.includes(randomNumber)); // 检查随机数是否已存在于数组中

  // 将随机数添加到已生成的随机数数组中
  generatedNumbers.push(randomNumber);

  return randomNumber;
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
  background-image: url("/src/assets/wallhaven-1q83qg_3840x1600.png");
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
  margin-top: 2rem;
  // background: antiquewhite;
}

.skeletons {
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
