import { axios } from '@/utils/request'
import api from './index'

// auth
export function login (parameter) {
  return axios({
    url: api.LOGIN,
    method: 'post',
    data: parameter
  })
}

export function logout (parameter) {
  return axios({
    url: api.LOGOUT,
    method: 'post',
    data: parameter
  })
}

export function getInfo (parameter) {
  return axios({
    url: api.GET_USER_INFO,
    method: 'get'
  })
}

// sys_user
export function getSysUserByID (parameter) {
  return axios({
    url: api.GET_SYS_USER_BY_ID,
    method: 'get',
    params: parameter
  })
}

export function getSysUserList (parameter) {
  return axios({
    url: api.GET_SYS_USER_LIST,
    method: 'get',
    params: parameter
  })
}

export function deleteSysUser (parameter) {
  return axios({
    url: api.DELETE_SYS_USER,
    method: 'delete',
    params: parameter
  })
}

export function updateUserState (parameter) {
  return axios({
    url: api.UPDATE_SYS_USER_STATE,
    method: 'post',
    data: parameter
  })
}

export function saveSysUser (parameter) {
  return axios({
    url: api.SAVE_SYS_USER,
    method: 'post',
    data: parameter
  })
}

export function updateSysUser (parameter) {
  return axios({
    url: api.UPDATE_SYS_USER,
    method: 'post',
    data: parameter
  })
}

// sys_role
export function getSysRoleSelectList (parameter) {
  return axios({
    url: api.GET_SYS_ROLE_SELECT_LIST,
    method: 'get',
    params: parameter
  })
}

export function getSysRoleByID (parameter) {
  return axios({
    url: api.GET_SYS_ROLE_BY_ID,
    method: 'get',
    params: parameter
  })
}

export function getSysRoleList (parameter) {
  return axios({
    url: api.GET_SYS_ROLE_LIST,
    method: 'get',
    params: parameter
  })
}

export function deleteSysRole (parameter) {
  return axios({
    url: api.DELETE_SYS_ROLE,
    method: 'delete',
    params: parameter
  })
}

export function updateRoleState (parameter) {
  return axios({
    url: api.UPDATE_SYS_ROLE_STATE,
    method: 'post',
    data: parameter
  })
}

export function saveSysRole (parameter) {
  return axios({
    url: api.SAVE_SYS_ROLE,
    method: 'post',
    data: parameter
  })
}

export function updateSysRole (parameter) {
  return axios({
    url: api.UPDATE_SYS_ROLE,
    method: 'post',
    data: parameter
  })
}

// sys_menu
export function getSysMenuByID (parameter) {
  return axios({
    url: api.GET_SYS_MENU_BY_ID,
    method: 'get',
    params: parameter
  })
}

export function getSysMenuOriginalList (parameter) {
  return axios({
    url: api.GET_SYS_MENU_ORIGINAL_LIST,
    method: 'get',
    params: parameter
  })
}

export function getSysMenuList (parameter) {
  return axios({
    url: api.GET_SYS_MENU_LIST,
    method: 'get',
    params: parameter
  })
}

export function getSysMenuSelectList (parameter) {
  return axios({
    url: api.GET_SYS_MENU_SELECT_LIST,
    method: 'get',
    params: parameter
  })
}

export function deleteSysMenu (parameter) {
  return axios({
    url: api.DELETE_SYS_MENU,
    method: 'delete',
    params: parameter
  })
}

export function updateMenuState (parameter) {
  return axios({
    url: api.UPDATE_SYS_MENU_STATE,
    method: 'post',
    data: parameter
  })
}

export function saveSysMenu (parameter) {
  return axios({
    url: api.SAVE_SYS_MENU,
    method: 'post',
    data: parameter
  })
}

export function updateSysMenu (parameter) {
  return axios({
    url: api.UPDATE_SYS_MENU,
    method: 'post',
    data: parameter
  })
}
// sys_role_menu

export function saveSysRoleMenu (parameter) {
  return axios({
    url: api.SAVE_SYS_ROLE_MENU,
    method: 'post',
    data: parameter
  })
}
export function findSysRoleMenu (parameter) {
  return axios({
    url: api.GET_SYS_ROLE_MENU_BY_ID,
    method: 'get',
    params: parameter
  })
}
