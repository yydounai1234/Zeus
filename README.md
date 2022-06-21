# Zeus

适用于 vite rollup webpack 的插件，用于缓存用户 http 请求
## 使用方法

### vite

* 下载插件
```javascript
    npm install zeus-plugin
```
* 在 **vite.config.ts** 中添加插件
```javascript
    import { vitePlugin as zeus } from 'zeus-plugin'
    plugins: [...other plugins, zeus({
    cacheVersion: 100
  })]
```

简单的一步，即可在本地调试以及生产环境中使用缓存功能啦。

## 本地调试

* 下载依赖
```javascript
    pnpm install
```
* 运行脚本
```javascript
    pnpm run sw:dev
    pnpm run plugin:dev
    pnpm run vite:dev
```

> **rollup** 与 **webpack** 开发中。