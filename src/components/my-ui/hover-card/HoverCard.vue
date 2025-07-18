<template>
  <!-- From Uiverse.io by Praashoo7 -->
  <div
    class="main hover:-translate-y-2 duration-300 text-[var(--font-color)]"
    @mousemove="handleMove"
    @mouseleave="reset"
    :style="style"
    :class="{ 'card-bg': card }"
    @click="jumpDetails(props.article.id, props.article.isPrivate)"
  >
    <div class="card">
      <div class="fl">
        <div class="data">
          <img
            class="img"
            src="https://q9.itc.cn/q_70/images03/20241013/d770472d4906402c866b9c71a0c9927c.jpeg"
          />
          <div class="text">
            <div class="text_m">{{ article.title }}</div>
            <div class="text_s">平安</div>
          </div>
        </div>
      </div>
      <div v-if="props.article.isTop" class="card-top">
        <Icon icon="ph:push-pin-fill"></Icon>
      </div>
      <div class="card_content">
        <div class="switch_738 multi-line-ellipsis-3" v-if="!props.article.isPrivate">
          {{ props.article.content }}
        </div>

        <div @click="openModel" v-else>
          <div
            class="w-full h-[4.5rem] blur-md relative bg-[length:16px_16px] bg-[repeating-conic-gradient(#999_0_25%,#ccc_0_50%)]"
          ></div>
          <div
            class="absolute inset-0 flex items-center justify-center text-gray-600 text-2xl gap-2"
          >
            <Icon
              icon="solar:heart-lock-bold-duotone"
              style="color: red; font-size: 2rem"
            ></Icon>
            <span style="color: #000">她的心上了锁</span>
          </div>
        </div>

        <div class="btns">
          <div class="likes">
            <svg class="likes_svg" viewBox="-2 0 105 92">
              <path
                d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71Z"
              ></path></svg
            ><span class="likes_text">{{ props.article.like }}</span>
          </div>
          <div class="comments">
            <svg class="comments_svg" viewBox="-405.9 238 56.3 54.8" title="Comment">
              <path
                d="M-391 291.4c0 1.5 1.2 1.7 1.9 1.2 1.8-1.6 15.9-14.6 15.9-14.6h19.3c3.8 0 4.4-.8 4.4-4.5v-31.1c0-3.7-.8-4.5-4.4-4.5h-47.4c-3.6 0-4.4.9-4.4 4.5v31.1c0 3.7.7 4.4 4.4 4.4h10.4v13.5z"
              ></path>
            </svg>
            <span class="comments_text">{{ props.article.commentCount }}</span>
          </div>
          <div class="views">
            <svg class="views_svg" viewBox="0 0 30.5 16.5" title="Views">
              <path
                d="M15.3 0C8.9 0 3.3 3.3 0 8.3c3.3 5 8.9 8.3 15.3 8.3s12-3.3 15.3-8.3C27.3 3.3 21.7 0 15.3 0zm0 14.5c-3.4 0-6.2-2.8-6.2-6.2C9 4.8 11.8 2 15.3 2c3.4 0 6.2 2.8 6.2 6.2 0 3.5-2.8 6.3-6.2 6.3z"
              ></path></svg
            ><span class="views_text">{{ props.article.browse }}</span>
          </div>
        </div>
      </div>
      <div class="card_back"></div>
    </div>
  </div>
  <MyModal :title="'打开她的心扉'" ref="myModal" :lock-scroll="false" @click.stop>
    <div class="modal">
      <Icon
        icon="solar:heart-unlock-bold-duotone"
        style="color: red; font-size: 6rem"
      ></Icon>
      <span style="color: var(--font-color); font-size: 1.5rem; margin: 1rem 0"
        >输入开锁的钥匙</span
      >
      <div class="group" @click.stop>
        <input
          id="query"
          class="input"
          type="search"
          placeholder="钥匙*"
          name="searchbar"
          autocomplete="off"
          v-model="articlePwd"
        />
      </div>
      <MyButton :title="'提交'" @click="btnClick(props.article.id)"></MyButton>
    </div>
  </MyModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { getArticleIdByPwd } from "@/api/article";

interface Props {
  card?: boolean;
  article?: any;
}

const props = withDefaults(defineProps<Props>(), {
  card: false,
  article: null,
});
const router = useRouter();
const myModal = ref<any>(null);
const articlePwd = ref("");
const style = ref("");
const maxOffset = 20;
let frameId: number | null = null;

function handleMove(e: MouseEvent) {
  if (frameId) cancelAnimationFrame(frameId);

  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

  const x = offsetX * maxOffset;
  const y = offsetY * maxOffset;

  frameId = requestAnimationFrame(() => {
    style.value = `transform: translate(${x}px, ${y}px)`;
  });
}

function reset() {
  if (frameId) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
  style.value = `transform: translate(0px, 0px)`;
}

const jumpDetails = (id, isPrivate) => {
  if (isPrivate) {
    return;
  }
  router.push({
    path: "/details/book",
    query: { id: id },
  });
};
const openModel = () => {
  myModal.value?.open();
};
const btnClick = (pawId: string) => {
  if (!articlePwd.value) {
    window.$message.warning("你忘记填写钥匙了");
    return;
  }
  getArticleIdByPwd({ pawId: pawId, pwd: articlePwd.value }).then((res) => {
    if (res.code == 200) {
      window.$message.success("你已成功打开！！！");
      router.push({
        path: "/details/book",
        query: { id: res.data },
      });
    } else if (res.code == 102) {
      window.$message.error("错误的钥匙");
    }
  });
};
</script>

<style src="../leave-message-form/style.scss" scoped></style>
<style lang="scss" scoped>
.card {
  margin: auto;
  height: 11em;
  border-radius: 7px;
  cursor: pointer;
  border: 1px dashed;
  border-color: rgba(162, 179, 207, 0.2);
  position: relative;
  transition: transform 0.1s ease-out;
  &-bg {
    box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
    background-color: var(--paper-card-bg-color);
  }
  &-top {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 2rem;
    color: red;
  }
}
.modal {
  max-width: 300px;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  margin: auto;
  display: flex;
  font-family: "Noto Serif SC", serif;
}
.fl {
  display: flex;
  justify-content: space-between;
  opacity: 1;
  transition: 0.2s ease-in-out;
}

.card_back {
  position: absolute;
  height: 0em;
  background-color: rgba(218, 215, 217, 0.315);
  border-radius: 7px;
  transition: 0.2s ease-in-out;
  z-index: -1;
  top: -1rem;
}

.main:hover .card_back {
  margin-left: 0em;
  height: 13rem;
  width: 100%;
  cursor: pointer;
  transform: scale(1.05, 1);
}

.main:hover .fullscreen {
  opacity: 1;
  cursor: pointer;
  margin-right: 0.5em;
}

.data {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  margin-left: 1rem;
}

.img {
  width: 2.25em;
  height: 2.25em;
  border-radius: 5px;
  overflow: hidden;
}

.text {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 0.5em;
  font-family: Montserrat;
  color: rgb(109, 107, 107);
}

.text_m {
  font-weight: bold;
  font-size: 0.9em;
}

.text_s {
  font-size: 0.7em;
}

.btns {
  margin-top: 5px;
  display: flex;
  gap: 0.5em;
  transition: 0.2s ease-in-out;
}

.likes {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 1.4em;
  border-radius: 4px;
  opacity: 1;
  background-color: #83c8f3;
  transition: 0.2s ease-in-out;
}

.likes_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.likes_svg {
  width: 12px;
  height: 12px;
  fill: white;
}

.likes:hover {
  background-color: #83c8f3;
  cursor: pointer;
}

.comments {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 1.4em;
  border-radius: 4px;
  opacity: 1;
  background-color: #83c8f3;
  transition: 0.24s ease-in-out;
}

.comments_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.comments_svg {
  width: 12px;
  height: 12px;
  fill: white;
}

.comments:hover {
  background-color: #83c8f3;
  cursor: pointer;
}

.views {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  height: 1.4em;
  border-radius: 4px;
  opacity: 1;
  background-color: #83c8f3;
  transition: 0.28s ease-in-out;
}

.views_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.views_svg {
  width: 12px;
  height: 12px;
  fill: white;
}

.views:hover {
  background-color: #83c8f3;
  cursor: pointer;
}

.card_content {
  padding: 0.5rem 1rem 1rem 1rem;
}

/* The switch - the box around the slider */
.switch_738 {
  font-size: 1rem;
  font-family: "Noto Serif SC", serif;
  min-height: 4.5rem;
}

/* Hide default HTML checkbox */
.switch_738 .chk_738 {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider_738 {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 5px;
}

.slider_738:before {
  position: absolute;
  content: "";
  height: 0.5em;
  width: 2.4em;
  border-radius: 5px;
  left: -0.6em;
  top: 0.2em;
  background-color: white;
  box-shadow: 0 6px 7px rgba(0, 0, 0, 0.3);
  transition: 0.4s;
}

.slider_738:before,
.slider_738:after {
  content: "";
  display: block;
}

.slider_738:after {
  background: linear-gradient(transparent 50%, rgba(255, 255, 255, 0.15) 0) 0 50% / 50%
      100%,
    repeating-linear-gradient(
        90deg,
        rgb(255, 255, 255) 0,
        rgb(255, 255, 255),
        rgb(255, 255, 255) 20%,
        rgb(255, 255, 255) 20%,
        rgb(255, 255, 255) 40%
      )
      0 50% / 50% 100%,
    radial-gradient(circle at 50% 50%, rgb(255, 255, 255) 25%, transparent 26%);
  background-repeat: no-repeat;
  border: 0.25em solid transparent;
  border-left: 0.4em solid #ffffff;
  border-right: 0 solid transparent;
  transition: border-left-color 0.1s 0.3s ease-out, transform 0.3s ease-out;
  transform: translateX(-22.5%) rotate(90deg);
  transform-origin: 25% 50%;
  position: relative;
  top: 0.5em;
  left: 0.55em;
  width: 2em;
  height: 1em;
  box-sizing: border-box;
}

.chk_738:checked + .slider_738 {
  background-color: limegreen;
}

.chk_738:focus + .slider_738 {
  box-shadow: 0 0 1px limegreen;
}

.chk_738:checked + .slider_738:before {
  transform: translateY(2.3em);
}

.chk_738:checked + .slider_738:after {
  transform: rotateZ(90deg) rotateY(180deg) translateY(0.45em) translateX(-1.4em);
}
</style>
