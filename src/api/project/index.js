import service from '@/utils/request'

/**
 * @description: 获取当前实施情况
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function getAllProject() {
  return service({
    url: `/pointPosition/getPointPosition`,
    method: 'post'
  })
}

/**
 * @description: 添加新实施
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function addPointPosition(params) {
  return service({
    url: `/pointPosition/addPointPosition`,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data:  params 
  })
}
