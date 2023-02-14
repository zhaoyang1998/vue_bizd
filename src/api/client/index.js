import service from '@/utils/request'

/**
 * @description: 获取所有的客户
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function getAllClient(params) {
  return service({
    url: '/client/getClients',
    method: 'post',
    data: params
  })
}

export function addClient(param) {
  return service({
    url: '/client/addClient',
    method: 'post',
    data: param
  })
}

export function getClientsByKeyword(param) {
  return service({
    url: '/client/getClientsByKeyword',
    method: 'post',
    data: param
  })
}

export function delClient(param) {
  return service({
    url: '/client/delClient',
    method: 'post',
    data: param
  })
}

export function updateClient(param) {
  return service({
    url: '/client/updateClient',
    method: 'post',
    data: param
  })
}