import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '@/stores/pinia'
import routes from './routers'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置，直接返回该位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则滚动到顶部
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.start()
  // await new Promise((resolve) => setTimeout(resolve, 1000))
  if (!router.hasRoute(to.name)) {
    next({ path: '/404' })
  } else {
    next()
  }
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  loadingStore.end()
})

router.onError(() => {
  const loadingStore = useLoadingStore()
  loadingStore.end()
})

export default router
