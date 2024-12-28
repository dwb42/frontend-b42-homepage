
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
      localStorage.setItem('jwt_token', token)
    },
    clearUserData() {
      this.user = { id: null, email: '' }
      this.token = null
      localStorage.removeItem('jwt_token')
    },
  },
})
