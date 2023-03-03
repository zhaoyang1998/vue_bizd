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
export function getDeliveryUser() {
  return service({
    url: `/user/getUsersByType` + '?type=' + 1,
    method: 'post',
  })
}

export function addUser(param) {
  return service({
    url: `/user/addUser`,
    method: 'post',
    data: param
  })
}

export function updateUser(param) {
  return service({
    url: `/user/updateUser`,
    method: 'post',
    data: param
  })
}

export function getUsersByKeyword(param) {
  return service({
    url: '/user/getUsersByKeyword',
    method: 'post',
    data: param
  })
}

export function delUser(param) {
  return service({
    url: '/user/delUser',
    method: 'post',
    data: param
  })
}

export function getAllUsers() {
  return service({
    url: '/user/getAllUsers',
    method: 'get',
  })
}
