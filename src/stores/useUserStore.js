
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: { id: null, email: '' },
    token: null,
  }),
  actions: {
    setUserData(userData) {
      this.user.id = userData.id
      this.user.email = userData.email
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    clearUserData() {
      this.user = { id: null, email: '' }
      this.token = null
      localStorage.removeItem('token')
    },
    initializeFromLocalStorage() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
      }
    }
  },
})
