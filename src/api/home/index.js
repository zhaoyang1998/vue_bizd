/*
 * @Description: 首页
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2022-06-21 05:29:36
 * @LastEditors: gumingchen
 * @LastEditTime: 2022-06-21 05:29:36
 */
import service from '@/utils/request'

/**
 * @description: 获取最近30天登录量
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function visitsApi() {
  return service({
    url: '/admin/home/visits',
    method: 'get'
  })
}
export function getHomePageData(param) {
  return service({
    url: '/common/getHomePageData/' + param,
    method: 'get'
  })
}
