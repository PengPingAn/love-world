import { createVNode, render } from 'vue'
import Message from './Notifications.vue'

const instances: { el: HTMLElement; vm: any; close: () => void }[] = []
const MAX_COUNT = 3
const GAP = 10
const RIGHT = 20
const BASE_BOTTOM = 20

export function createMessage(type = 'info') {
    return (content: string, duration = 3000) => {
        const container = document.createElement('div')
        document.body.appendChild(container)

        let vm: any

        const close = () => {
            render(null, container)
            document.body.removeChild(container)
            const index = instances.findIndex(i => i.el === container)
            if (index !== -1) {
                instances.splice(index, 1)
                updatePositions() // 🔁 重新定位
            }
        }

        const vnode = createVNode(Message, {
            content,
            type,
            duration,
            onClose: close,
            ref: (el) => {
                vm = el
            }
        })

        render(vnode, container)

        instances.unshift({ el: container, vm, close })

        // 控制最大数量
        if (instances.length > MAX_COUNT) {
            const last = instances.pop()
            last?.close()
        }
        // if (instances.length >= MAX_COUNT) {
        //     const first = instances[0]
        //     first.vm?.close() // 会触发动画
        //   }
          

        // ✨ 关键：确保在 DOM 渲染完后再更新位置
        requestAnimationFrame(() => {
            updatePositions()
        })
    }
}

function updatePositions() {
    let currentBottom = BASE_BOTTOM
    instances.forEach(({ el }) => {
        const card = el.querySelector('.card') as HTMLElement
        if (card) {
            card.style.position = 'fixed'
            card.style.right = `${RIGHT}px`
            card.style.bottom = `${currentBottom}px`
            currentBottom += card.offsetHeight + GAP
        }
    })
}

export const message = {
    success: createMessage('success'),
    error: createMessage('error'),
    warning: createMessage('warning'),
    info: createMessage('info')
}
