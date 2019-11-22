const api = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  GET_USER_INFO: '/auth/info',

  // sys_user
  GET_SYS_USER_LIST: '/sys/user/list',
  GET_SYS_USER_BY_ID: '/sys/user/find',
  SAVE_SYS_USER: '/sys/user/save',
  UPDATE_SYS_USER: '/sys/user/update',
  UPDATE_SYS_USER_STATE: '/sys/user/updateState',
  UPDATE_SYS_USER_PASSWORD: '/sys/user/updatePassword',
  DELETE_SYS_USER: '/sys/user/delete',
  // sys_role
  GET_SYS_ROLE_LIST: '/sys/role/list',
  GET_SYS_ROLE_SELECT_LIST: '/sys/role/selectList',
  GET_SYS_ROLE_BY_ID: '/sys/role/find',
  SAVE_SYS_ROLE: '/sys/role/save',
  UPDATE_SYS_ROLE: '/sys/role/update',
  UPDATE_SYS_ROLE_STATE: '/sys/role/updateState',
  DELETE_SYS_ROLE: '/sys/role/delete',
  // sys_menu
  GET_SYS_MENU_LIST: '/sys/menu/list',
  GET_SYS_MENU_ORIGINAL_LIST: '/sys/menu/originalList',
  GET_SYS_MENU_SELECT_LIST: '/sys/menu/selectList',
  GET_SYS_MENU_BY_ID: '/sys/menu/find',
  SAVE_SYS_MENU: '/sys/menu/save',
  UPDATE_SYS_MENU: '/sys/menu/update',
  UPDATE_SYS_MENU_STATE: '/sys/menu/updateState',
  DELETE_SYS_MENU: '/sys/menu/delete',

  // sys_role_menu
  SAVE_SYS_ROLE_MENU: '/sys/rolemenu/save',
  GET_SYS_ROLE_MENU_BY_ID: '/sys/rolemenu/find'

}
export default api
