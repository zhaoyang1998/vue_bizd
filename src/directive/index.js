import { nextTick } from 'vue'
import { havePermission } from '@/utils'

export default {
  install: function (app) {
    /**
     * @description: 权限控制指令
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    app.directive('permission', {
      mounted: (el, binding, vnode) => {
        const permission = binding.value
        const result = havePermission(permission)
        const tagName = el.localName
        if (!result) {
          switch (tagName) {
            case 'button': // 按钮权限控制-删除tag
              el.remove()
              break
            case 'div': // element-plus switch 组件权限控制
              if (vnode.props && vnode.props.class && vnode.props.class.includes('el-switch')) {
                nextTick(() => {
                  el.className += ' is-disabled' // 设置禁用样式
                  const tag = el.cloneNode(true) // 深拷贝节点以解除绑定事件
                  const parent = el.parentNode
                  el.remove()
                  parent.append(tag)
                })
              }
              break
          }
        }
      }
    })

    /**
     * @description: 表单防止重复提交指令
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    app.directive('repeat', {
      mounted(el, binding) {
        el.addEventListener('click', () => {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
              el.disabled = false
            }, binding.value || 2000)
          }
        })
      }
    })
  }
}
