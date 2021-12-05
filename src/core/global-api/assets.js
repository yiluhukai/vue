/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // filter/component/directive
  // 三个方法的参数一致，可以在文档中查看
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 第二个参数不存在，是去获取id对应的函数
      if (!definition) {
        // Vue.options在index.js中有定义
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        // 开发环境中去验证组件的名称是否合法
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 当使用Vue.component方法创建组件时
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          //this.options._base  ===Vue
          // 返回VueComponent函数
          definition = this.options._base.extend(definition)
        }
        // 创建指令时传入的函数会作为指令的bind/update的钩子函数
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 将创建的filter/component/directive保存到Vue.options[types]中
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
