<template>
  <div class="m-auto max-w-[850px] pt-[3rem]">
    <h1 class="text-3xl">全部文章</h1>
    <div class="mt-8" v-for="item in 3" :key="item" @click="jumpDetails">
      <HoverCard></HoverCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MdPreview } from "md-editor-v3";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const content = ref(`
## # 生命的旷野

==落日西沉，炊烟袅袅。==

@linkCard[标题][https://q2.itc.cn/q_70/images03/20241013/6fe9a539a055473b8677c734558b462f.jpeg][这是一个描述](https://icon-sets.iconify.design/?query=link&search-page=1)

村里的环境==恬静==而舒适，深秋的风凉爽而不凛冽。@Pingan[此间别处](https://baidu.com)铁栅栏里是一条不长不短的小径，通往一座矮矮的房子。小径边上有一座小假山和一个小水塘，尚且算作修饰。在小屋的后面可以隐约看见远远的旷野。这是一片广阔之境。

坐在小方桌旁，等待饭菜上桌。夹起一口喷香出锅的鸡，配一瓶可乐，一群人围成一顿简单而丰满的晚餐。

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

`);

const jumpDetails=()=>{
    router.push(`/details/book`);
}
</script>
