# Zeus

**Zeus** 是一个插件。适用于 **vite**、 **rollup**、 **webpack** 等工具，只需要根据不同的打包工具导入对应插件，即可缓存绝大多数的 **http** 请求，并且具有前端 **DNS解析** 的能力，自动识别 **DNS IP** 地址的能力。
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
    pnpm run plugin:worker
    pnpm run plugin:zeus
    pnpm run vite:dev
```
## 命令行

- **vite:dev** : vite 项目开发调试
- **vite:build** : vite 项目打包
- **vite:preview** : vite 项目打包预览
- **plugin:zeus** : 插件开发调试
- **plugin:worker** : service wokrer 文件开发调试
- **plugin:build** : 插件与 service wokrer 打包
- **plugin:type** : 生成 type 文件


> **rollup** 与 **webpack** 开发中。