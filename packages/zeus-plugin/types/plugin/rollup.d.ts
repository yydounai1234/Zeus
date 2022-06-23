interface ZeusOption {
    html: string;
    scope: string;
    prefix: string;
    swName: string;
}
declare const _default: (option?: ZeusOption) => {
    name: string;
    enforce: string;
    resolveId(id: string): string | undefined;
    load(id: string): string | undefined;
    generateBundle(_: any, bundle: any, t: any): void;
};
export default _default;
