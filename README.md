# Zeus

**Zeus** 是一个 **vite** 插件，通过简单的插件引入，轻松获得缓存 app 本地文件与 fetch 请求的资源的能力，可以通过 []() 查看示例。

## 使用方法

* 下载插件
```javascript
npm install zeus-plugin --save-dev
```
* 在 **vite.config.ts** 中添加插件

```typescript
import zeusPlugin from 'zeus-plugin'
plugins: [...other plugins, zeusPlugin({
    /** cache 版本号 */
    cacheVersion: 1,
    /** sw 版本号 */
    swVersion: 1,
    /** 初始缓存文件 */
    appShellFiles: ["/source.webp"],
    /** 拦截缓存文件的正则 */
    patten: /image|png/
})]
```

完整配置如下：

```typescript
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
```

## 本地调试

* 下载依赖
```javascript
    pnpm install
```
* 运行脚本
```javascript
    pnpm run plugin:dev
    pnpm run demo:dev
```

## License

MIT License