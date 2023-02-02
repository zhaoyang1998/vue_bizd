import service from '@/utils/request'

/**
 * @description: 获取所有的客户
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function getAllClient(params) {
  return service({
    url: `/client/getClients`,
    method: 'post',
    data: params
  })
}