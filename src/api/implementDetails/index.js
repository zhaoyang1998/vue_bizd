import service from '@/utils/request'
import { parseJson2Param } from '@/utils/index'
import { getApiBaseUrl } from '@/utils'

export function getPPDetail(params) {
    return service({
        url: '/details/getPPDetail',
        method: 'post',
        data: params
    })
}

export function getNextPPDetail(params) {
    return service({
        url: '/details/getNextPPDetail',
        method: 'post',
        data: params
    })
}

export function getPrevPPDetail(params) {
    return service({
        url: '/details/getPrevPPDetail',
        method: 'post',
        data: params
    })
}

export function updatePPDetail(params) {
    return service({
        url: '/details/updatePPDetail',
        method: 'post',
        data: params
    })
}


export function delPPDetail(param) {
    return service({
        url: '/details/delPPDetail/' + param,
        method: 'GET',
    })
}

export function getAllDetail(param) {
    return service({
        url: '/details/getAllDetail/' + param,
        method: 'GET',
    })
}

export function saveDetail(params) {
    return service({
        url: '/details/saveDetail',
        method: 'post',
        data: params
    })
}