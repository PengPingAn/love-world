<template>
  <div class="w-full items-center justify-center px-8 mt-24">
    <TracingBeam class="px-6 text-[var(--font-color)]">
      <div class="text-2xl font-bold">
        <span>有些瞬间，记录下来就是永恒</span>
      </div>
      <div class="relative pt-4 antialiased">
        <div v-for="(item, index) in dummyContent" :key="`content-${index}`" class="mb-10">
          <div
            class="mb-4 w-fit rounded-full bg-black px-2 text-sm text-white dark:bg-white dark:text-black"
          >
            {{ item.badge }}
          </div>

          <p :class="['mb-4 text-xl']">
            {{ item.title }}
          </p>
          <div class="prose prose-sm dark:prose-invert text-sm flex flex-wrap gap-4">
            <div class="card" v-for="img in item.image" v-if="item.image">
              <img
                :src="img"
                alt="blog thumbnail"
                class="rounded-lg object-cover w-[15rem] max-h-[11rem]"
              />
              <div class="card__content" @click="open(img)">
                <p class="card__title">路</p>
                <p class="card__description multi-line-ellipsis">这是照片的简介</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <p v-for="(paragraph, idx) in item.description" :key="`desc-${idx}`">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </TracingBeam>
  </div>

  <Dialog ref="myDialog" :imgUrl="imgUrl" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from './dialog.vue'

const myDialog = ref(null)
const imgUrl = ref(null)
// Dummy content data
const dummyContent = [
  {
    title: '这是照片',
    description: ['这是一张照片'],
    badge: '2025-05-20',
    image: [
      'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg',
      'https://cdn.pixabay.com/photo/2017/06/10/11/52/in-xinjiang-2389763_1280.jpg',
      'https://blog.grtsinry43.com/uploads/2025/03/02/779c70348267b6f978d08c2296ffe869.webp_849fa847-1025-47d2-8239-90de18f2dbc4.webp'
    ]
  },
  {
    title: '这是照片',
    description: ['这是一张照片'],
    badge: '2025-05-19',
    image: [
      'https://cdn.shortpixel.ai/spai/q_lossless+ret_img+to_auto/https://independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled-3840x1560-1.jpeg',
      'https://img.freepik.com/free-photo/fuji-mountain-kawaguchiko-lake-morning-autumn-seasons-fuji-mountain-yamanachi-japan_335224-102.jpg?t=st=1748238100~exp=1748241700~hmac=4d4375d4eceb15ee646d42fae3ce892ab6966f467b2a24b90e6ac0a693103c9c&w=1800',
      'https://img.freepik.com/free-photo/beautiful-cherry-blossoms-trees-blooming-spring_335224-878.jpg?t=st=1748238174~exp=1748241774~hmac=c66d47d1729fd66511d9d430164313381ed821b816622c21c93f0570ac2704e6&w=1800',
      'https://img.freepik.com/free-photo/boatman-punting-boat-river-arashiyama-autumn-season-along-river-kyoto-japan_335224-22.jpg?semt=ais_hybrid&w=740'
    ]
  },
  {
    title: '这是照片',
    description: ['这是一张照片'],
    badge: '2025-05-17',
    image: [
      'https://img.freepik.com/free-photo/autumn-season-fuji-mountain-kawaguchiko-lake-japan_335224-249.jpg?semt=ais_hybrid&w=740',
      'https://img.freepik.com/free-photo/fuji-mountain-kawaguchiko-lake-japan_335224-106.jpg?t=st=1748238296~exp=1748241896~hmac=926a46a403c274fecdefb302953de85a118d0a7eb924f2d138f6195511ee0e81&w=1800',
      'https://img.freepik.com/free-photo/beautiful-landscape-road-side-around-lake-kawaguchiko_74190-3006.jpg?t=st=1748238336~exp=1748241936~hmac=e426a7a72c2559d8c5be51a9b3f0ff415f9fa7f4a2287418909fe9b1f8a4f11c&w=1800',
      'https://img.freepik.com/free-photo/brissago-islands-branches-alpine-lake-maggiore-mountains-ticino-switzerland_181624-20583.jpg?t=st=1748238362~exp=1748241962~hmac=103485a5be7dc43ff78ea2d5c400e3ab289ebc00ebaa371c73900de8a89ef7d3&w=1800',
      'https://img.freepik.com/free-photo/fuji-mountain-kawaguchiko-lake-sunset-autumn-seasons-fuji-mountain-yamanachi-japan_335224-1.jpg?t=st=1748238384~exp=1748241984~hmac=a50692e158a3e38f9e10563112fc9b40a2736e8ec6d683e6e0cd344fdf620622&w=1800'
    ]
  },
  {
    title: '这是照片',
    description: ['这是一张照片'],
    badge: '2025-05-16',
    image: [
      'https://img.freepik.com/free-photo/fuji-mountain-cherry-blossoms-spring-japan_335224-230.jpg?t=st=1748238424~exp=1748242024~hmac=ff954b5537b0fa5bfdd95a84a083d5431a346507dc6409bb4b21de60f6ac7a24&w=1800'
    ]
  }
]

const open = (val) => {
  console.log('open')
  myDialog.value.open()
  imgUrl.value = val
}
</script>

<style lang="scss" scoped>
/* From Uiverse.io by gharsh11032000 */
.card {
  position: relative;
  cursor: pointer;
  //   width: 300px;
  //   height: 200px;
  //   background: linear-gradient(-45deg, #f89b29 0%, #ff0f7b 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card svg {
  width: 48px;
  fill: #333;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card:hover {
  transform: rotate(-5deg) scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #0000008a;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card:hover .card__content {
  transform: translate(-50%, -50%) rotate(0deg);
  opacity: 1;
}

.card__title {
  margin: 0;
  font-size: 24px;
  color: #e4dddd;
  font-weight: 700;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #adacac;
  line-height: 1.4;
}

.card:hover svg {
  scale: 0;
  transform: rotate(-45deg);
}
</style>
