export default {
  isAuthenticated: false,
  authenticate () {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true
      setTimeout(resolve, 100) // fake async
    })
  },
  signOut () {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = false
      setTimeout(resolve, 100) // fake async
    })
  }
}
