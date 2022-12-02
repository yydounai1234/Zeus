declare type ZeusOption = Partial<{
    /**
     * 作用域
     */
    scope: string;
    /**
     * 前缀
     */
    prefix: string;
    /**
     * SW 名
     */
    swName: string;
}> & {
    /**
     * SW 版本号
     */
    swVersion: string;
    /**
     * 缓存版本号
     */
    cacheVersion: string;
    /**
     * 初始缓存文件
     */
    appShellFiles: string[];
    /**
     * 缓存请求正则
     */
    patten: RegExp;
};
declare const _default: (option: ZeusOption) => {
    name: string;
    transformIndexHtml(html: string): string;
    resolveId(id: string): string | undefined;
    load(id: string): string | undefined;
    writeBundle(options: any): void;
};
export default _default;
