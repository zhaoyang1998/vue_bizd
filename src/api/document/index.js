import service from '@/utils/request'

/**
 * @description: 获取当前实施文档内容
 * @param {*}
 * @return {*}
 * @author: 赵阳
 */
export function getDocApi(params) {
  return service({
    url: `/document/getDoc`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 上传当前实施文档内容
 * @param {*}
 * @return {*}
 * @author: 赵阳
 */
export function saveContentApi(params) {
    return service({
      url: `/document/saveFile`,
      method: 'post',
      data: params
    })
  }