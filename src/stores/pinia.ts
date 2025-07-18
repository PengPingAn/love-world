import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    isLoading2: false,
    isFull: false,
    isMaxHeight: false,
  }),
  actions: {
    start() {
      this.isLoading = true
    },
    end() {
      this.isLoading = false
    },
    open(options?: { isFull?: boolean; isMaxHeight?: boolean }) {
      this.isLoading2 = true
      this.isFull = options?.isFull ?? false
      this.isMaxHeight = options?.isMaxHeight ?? false
    },
    close() {
      this.isLoading2 = false
      this.isFull = false
      this.isMaxHeight = false
    }
  }
})


export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    webSite: ''
  }),
  actions: {
    setUser(name: string, email: string, webSite: string) {
      this.name = name
      this.email = email
      this.webSite = webSite
    }
  },
  persist: true // 开启持久化
})

export const useEditorThemeStore = defineStore('editorTheme', {
  state: () => ({
    editorTheme: 'light'
  }),
  actions: {
    setUser(editorTheme: string) {
      this.editorTheme = editorTheme
    }
  },
  persist: true // 开启持久化
})

export const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    socketId: ''
  }),
  actions: {
    setUser(socketId: string) {
      this.socketId = socketId
    }
  },
  persist: true // 开启持久化
})
