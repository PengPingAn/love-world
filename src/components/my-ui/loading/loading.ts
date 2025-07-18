import type { Pinia } from 'pinia'
import { useLoadingStore } from '@/stores/pinia'

let _pinia: Pinia | null = null

const loading = {
    injectPinia(pinia: Pinia) {
        _pinia = pinia
    },
    open(options?: { isFull?: boolean; isMaxHeight?: boolean }) {
        // if (!_pinia) return
        const store = useLoadingStore(_pinia)
        store.open(options)
    },
    close() {
        // if (!_pinia) return
        const store = useLoadingStore(_pinia)
        store.close()
    }
}

export default loading
