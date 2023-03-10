import { ContentType } from '@/utils/dictionary'
import service from '@/utils/request'
import { download } from '@/utils'

/**
 * @description: 获取当前实施情况
 * @param {*}
 * @return {*}
 * @author: longyuyu
 */
export function getAllPointPosition(params) {
  return service({
    url: `/pointPosition/getPointPosition`,
    method: 'post',
    data: params
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
    data: params
  })
}

export function getPointPositionByKeyword(param) {
  return service({
    url: '/pointPosition/GetPointPositionByKeyword',
    method: 'post',
    data: param
  })
}

export function delPointPosition(param) {
  return service({
    url: '/pointPosition/delPointPosition',
    method: 'post',
    data: param
  })
}
export function startAssignment(param) {
  return service({
    url: '/pointPosition/startAssignment',
    method: 'post',
    data: param
  })
}
export function finishAssignment(param) {
  return service({
    url: '/pointPosition/finishAssignment/' + param,
    method: 'GET',
  })
}

export function allocatingAssignment(param) {
  return service({
    url: '/pointPosition/allocatingAssignment',
    method: 'POST',
    data: param
  })
}

export function cancelAssignment(param) {
  return service({
    url: '/pointPosition/cancelAssignment',
    method: 'POST',
    data: param
  })
}


export function updatePointPosition(param) {
  return service({
    url: '/pointPosition/updatePointPosition',
    method: 'POST',
    data: param
  })
}

export async function exportExcel(param) {
  const r = await service({
    url: '/pointPosition/exportExcel',
    method: 'POST',
    data: param,
    responseType:'arraybuffer'
  })
  if (r) {
    const { blob, name} = r
    download(blob, name)
  }
}
