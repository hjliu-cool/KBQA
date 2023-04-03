import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    levelList: {
      '1': '无权限',
      '2': '普通用户',
      '3': '起草合同',
      '4': '审批管理员',
      '5': '超级管理员',
    },
  },
  mutations: {},
  actions: {},
  modules: {},
})
