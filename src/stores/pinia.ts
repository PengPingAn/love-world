import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({ isLoading: false }),
  actions: {
    start() { this.isLoading = true },
    end() { this.isLoading = false }
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
    },
  },
  persist: true, // 开启持久化
})