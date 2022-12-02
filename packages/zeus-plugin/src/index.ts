import swTemplate from './sw?raw'
import * as fs from 'fs'
type ZeusOption = Partial<{
  /**
   * 作用域
   */
  scope: string
  /**
   * 前缀
   */
  prefix: string
  /**
   * SW 名
   */
  swName: string
}> & {
  /**
   * SW 版本号
   */
  swVersion: string
  /**
   * 缓存版本号
   */
  cacheVersion: string
  /**
   * 初始缓存文件
   */
  appShellFiles: string[]
  /**
   * 缓存请求正则
   */
  patten: RegExp
}

/**
 * 默认配置
 */
const defaultZeusOption = {
  prefix: '',
  scope: '',
  swName: 'sw',
}

/**
 * 注入 sw
 * @param htmlString 原始 html 字符串
 * @param scope 作用域
 * @param prefix 前缀
 * @param swName SW 名
 * @returns
 */
const applyServiceWorkerRegistration = (
  htmlString: string,
  scope: string,
  prefix: string,
  swName: string,
  swVersion: string
) => {
  const addScope = !!scope
  const addPrefix = !!prefix
  return `${htmlString}
  <script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register('/${addPrefix ? `${prefix}/` : ''}${swName}_${swVersion}.js'${
    addScope ? `,{ scope: './${scope}' }` : ''
  })
        .then(function() {
          console.log('ServiceWorker registered.');
        })
        .catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
  </script>`
}

export default (option: ZeusOption) => {
  const _option = { ...defaultZeusOption, ...option }
  const virtualModuleId = `/${_option.swName}_${_option.swVersion}.js`
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vite-plugin-zeus',
    transformIndexHtml(html: string) {
      const _html = applyServiceWorkerRegistration(
        html,
        _option.scope,
        _option.prefix,
        _option.swName,
        _option.swVersion
      )
      return _html
    },
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const template = swTemplate
          .replace(/zeus_cacheVersion/g, String(_option.cacheVersion))
          .replace(/zeus_appShellFiles/g, JSON.stringify(_option.appShellFiles))
          .replace(/zeus_patten/g, String(_option.patten))
        return template
      }
    },
    writeBundle(options: any) {
      const template = swTemplate
        .replace(/zeus_cacheVersion/g,String(_option.cacheVersion))
        .replace(/zeus_appShellFiles/g, JSON.stringify(_option.appShellFiles))
        .replace(/zeus_patten/g, String(_option.patten))
      fs.writeFileSync(`${options.dir}/${_option.swName}_${_option.swVersion}.js`, template, {
        encoding: 'utf8',
      })
    },
  }
}
