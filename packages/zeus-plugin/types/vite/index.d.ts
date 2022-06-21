interface ZeusOption {
    html?: string;
    scope?: string;
    prefix?: string;
    swName?: string;
    /**
     * 缓存版本号
     */
    cacheVersion: number;
}
declare const _default: (option?: ZeusOption) => {
    name: string;
    transformIndexHtml(html: string): string;
    resolveId(id: string): string | undefined;
    load(id: string): any;
};
export default _default;
