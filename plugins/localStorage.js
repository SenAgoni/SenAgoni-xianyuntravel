import createPersistedState from 'vuex-persistedstate'
// 这个是把数据存储到本地存储中
export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
    })(store)
  })
}