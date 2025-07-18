<template>
  <div v-for="item in props.cardInfo" :key="item.title" class="cursor-pointer">
    <ClientOnly>
      <CardContainer class="w-full">
        <CardBody
          class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] w-full max-w-sm"
          @click="jumpPage(item.router)"
        >
          <CardItem
            :translate-z="50"
            class="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {{ item.title }}
          </CardItem>
          <CardItem
            as="p"
            translate-z="60"
            class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
          >
            {{ item.description }}
          </CardItem>
          <CardItem :translate-z="100" class="mt-4 w-full flex justify-center">
            <img
              :src="item.imgUrl"
              height="300"
              width="300"
              class="h-40 w-full rounded-xl object-cover group-hover/card:shadow-xl"
              alt="thumbnail"
              style="width: 250px; height: 170px; object-fit: cover"
            />
          </CardItem>
          <div class="mt-4 flex items-center justify-between">
            <CardItem
              :translate-z="20"
              as="a"
              target="__blank"
              class="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
            >
              跳转 →
            </CardItem>
            <CardItem
              :translate-z="20"
              as="button"
              class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
            >
              Go Go Go
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = withDefaults(defineProps<{ cardInfo?: any[] }>(), {
  cardInfo: () => [],
});

//src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const router = useRouter();
const gridItems = [
  {
    icon: "lucide:box",
    title: "记录瞬间",
    description: "记录美好瞬间",
    url: "/photoAlbum",
    imgUrl: "/src/assets/img/1.png",
  },
  {
    icon: "lucide:settings",
    title: "点点滴滴",
    description: "我们的点点滴滴",
    url: "/articles",
    imgUrl: "/src/assets/img/2.png",
  },
  {
    icon: "lucide:music",
    title: "留言祝福",
    description: "书写你的留言祝福",
    url: "/leaveMessage",
    imgUrl: "/src/assets/img/3.png",
  },
  {
    icon: "lucide:sparkles",
    title: "计划事件",
    description: "约定一起完成的事情",
    url: "/things",
    imgUrl: "/src/assets/img/4.png",
  },
];

const jumpPage = (url) => {
  console.log(url);
  router.push(url);
};
</script>
