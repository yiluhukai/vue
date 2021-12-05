/* @flow */

import { toArray } from '../util/index'
// 这块代码我们可以发现Vue.use()可以支持链式调用
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 避免插件的重复调用
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    // 将arguments转换成数组，并删除第一个元素
    // additional parameters
    const args = toArray(arguments, 1)
    // 此处的this === Vue
    args.unshift(this)

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
