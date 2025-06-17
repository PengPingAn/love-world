
const TITLE_NAME = "Polaris的小破站 - ";
//路由数组
const routes = [
    {
        //基本格式
        path: "/",
        name: "index",
        meta: { title: TITLE_NAME + '首页' },
        component: () => import('@/views/home/index.vue'),
    },
    {
        //基本格式
        path: "/photoAlbum",
        name: "photoAlbum",
        meta: { title: TITLE_NAME + '相册' },
        component: () => import('@/views/photo-album/index.vue'),
    },
    {
        //基本格式
        path: "/articles",
        name: "articles",
        meta: { title: TITLE_NAME + '点滴' },
        component: () => import('@/views/articles/index.vue'),
    },
    {
        path: "/details/:id",
        name: "details",
        meta: { title: TITLE_NAME + '点滴' },
        component: () => import('@/views/articles/details.vue'),
        props: true,  // 将路由参数作为 props 传递给组件
    },
    {
        path: "/leaveMessage",
        name: "leaveMessage",
        meta: { title: TITLE_NAME + '留言' },
        component: () => import('@/views/leave-message/index.vue'),
        props: true,  // 将路由参数作为 props 传递给组件
    },
    {
        path: "/things",
        name: "things",
        meta: { title: TITLE_NAME + '动态' },
        component: () => import('@/views/things/index.vue'),
        props: true,  // 将路由参数作为 props 传递给组件
    },
]

export default routes