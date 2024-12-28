
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: { id: null, email: '' },
  }),
  actions: {
    setUserData(userData) {
      this.user.id = userData.id
      this.user.email = userData.email
    },
    clearUserData() {
      this.user = { id: null, email: '' }
    },
  },
})
