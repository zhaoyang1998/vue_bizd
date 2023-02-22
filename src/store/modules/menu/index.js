/* 获取用户权限的路由路径
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-04-02 18:59:43
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-04-18 09:16:20
 */
import { getGet, setGet, clearGet, getMenuAndPermission, setMenuAndPermission, clearMenuAndPermission } from '@/utils/storage'
import { MENU_KEY, PERMISSION_KEY } from '@/utils/constant'
import { selfInfoApi } from '@/api/enterprise-menu'

// 初始化菜单 权限 数据
const data = getMenuAndPermission()

/**
 * @description: 递归筛选出 目录、菜单
 * @param {Array} list
 * @param {Number} mode 1-显示的 2-所有的
 * @return {*}
 * @author: gumingchen
 */
function menuProcessing(list = [], mode = 1) {
  const result = []
  list.forEach(item => {
    if (item.type !== 2) {
      if (mode === 2 || item.show === 1) {
        const menu = {
          id: item.menu_id,
          name_cn: item.name_cn,
          name_en: item.name_en,
          icon: item.icon,
          type: item.type,
          url: item.url,
          path: item.type === 3 ? `/i-${ item.menu_id }` : item.path || (item.url ? `/${ item.url.replace(/\//g, '-') }` : ''),
          name: item.type === 3 ? `i-${ item.menu_id }` : item.name || (item.url ? item.url.replace(/\//g, '-') : ''),
          children: []
        }
        if (item.children && item.children.length > 0) {
          menu.children = menuProcessing(item.children, mode)
        }
        result.push(menu)
      }
    }
  })
  return result
}

export default {
  state: {
    get: getGet(),
    menus: data[MENU_KEY],
    permissions: data[PERMISSION_KEY],
    active: '',
    collapse: false
  },
  getters: {
    menus: state => {
      return menuProcessing(state.menus)
    },
    pages: state => {
      return menuProcessing(state.menus, 2)
    },
    permissions: state => {
      return state.permissions
    }
  },
  mutations: {
    SET_GET: (state, get) => {
      state.get = get
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ACTIVE: (state, active) => {
      state.active = active
    },
    SET_COLLAPSE: (state, collapse) => {
      state.collapse = collapse
    }
  },
  actions: {
    /**
     * 设置是否获取过 菜单 权限
     * @param {*}
     * @returns
     */
    setGet({ commit }, val = true) {
      setGet(val)
      commit('SET_GET', val)
    },
    /**
     * 获取当前管理员 菜单 权限
     * @param {*}
     * @returns
     */
    async getMenuAndPermission({ commit, dispatch }) {
      const r = await selfInfoApi()
      // const r=false
      const data = JSON.parse(r.data)
      if (r) {
        dispatch('setGet', true)
        setMenuAndPermission(data)
        commit('SET_MENUS', data.menus)
        commit('SET_PERMISSIONS', data.permissions)
      }
      return r && data ? data.menus : []
    },
    /**
     * 设置选中菜单
     * @param {*}
     * @returns
     */
    setActive({ commit }, active) {
      commit('SET_ACTIVE', active)
    },
    /**
     * 设置菜单是否折叠
     * @param {*}
     * @returns
     */
    setCollapse({ commit }, collapse) {
      commit('SET_COLLAPSE', collapse)
    },
    /**
     * 清除菜单 权限 信息
     * @param {*}
     */
    clear({ commit }) {
      clearGet()
      clearMenuAndPermission()
      commit('SET_GET', false)
      commit('SET_MENUS', [])
      commit('SET_PERMISSIONS', [])
    }
  }
}
