import service from '@/utils/request'

/**
 * @description: 获取所有的用户
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
 export function getAllUser() {
  return service({
    url: `/user/getUsers`,
    method: 'post'
  })
}
