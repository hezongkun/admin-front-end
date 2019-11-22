import Vue from 'vue'
import { login, getInfo, logout } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
// import router from '@/router'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // // 登录
    // Login ({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     login(userInfo).then(response => {
    //       const result = response.result
    //       Vue.ls.set(ACCESS_TOKEN, result.token, 24 * 60 * 60 * 1000)
    //       commit('SET_TOKEN', result.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          Vue.ls.set(ACCESS_TOKEN, result.data, 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.data)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data

          if (result.menus && result.menus.length > 0) {
            // const menus = result.menus
            // role.permissions = result.role.permissions
            // role.permissions.map(per => {
            //   if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            //     const action = per.actionEntitySet.map(action => { return action.action })
            //     per.actionList = action
            //   }
            // })
            // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.menus)
            commit('SET_INFO', result.userInfo)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.userInfo.nickname, welcome: welcome() })
          commit('SET_AVATAR', result.userInfo.headpic)

          resolve(result.menus)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          // router.push('/user/login')
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    }

  }
}

export default user
