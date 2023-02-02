import service from '@/utils/request'

/**
 * @description: 获取所有的用户
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function getAllUser(params) {
  return service({
    url: `/user/getUsers`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 根据用户类型获取用户
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function getUsersByType() {
  return service({
    url: `/user/getUsersByType` + '?type=' + 1,
    method: 'post',
  })
}
