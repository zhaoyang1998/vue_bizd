import { ContentType, TokenKey, StorageType, SuccessCode, RequestMapping, ModelBinding } from '@/utils/dictionary'

// request Mapping
export const MAPPING = RequestMapping.SLIPPER
// 请求数据类型
export const CONTENT_TYPE = ContentType.JSON
// 请求超时时长
export const TIME_OUT = 60000 * 2
// 访问秘钥 存储
export const TOKEN_KEY = TokenKey.TOKEN
// 秘钥本地存储类型
export const TOKEN_STORAGE = StorageType.COOKIE
// 菜单本地存储类型
export const MENU_STORAGE = StorageType.SESSION
export const IS_GET_MENU_KEY = 'isGet'
export const MENU_KEY = 'menus'
export const PERMISSION_KEY = 'permissions'
// 主题本地存储类型
export const THEME_STORAGE = StorageType.LOCAL
export const THEME_KEY = 'theme'
export const THEME_MODE_KEY = 'themeMode'
export const LAYOUT_KEY = 'layout'
// 请求成功响应code
export const SUCCESS_CODE = [SuccessCode.ZERO, SuccessCode.TWO_HUNDRED]
// 双向绑定方法名
export const MODEL_NAME = 'modelValue'
export const UPDATE_MODEL_EVENT = ModelBinding.MODEL_VALUE
