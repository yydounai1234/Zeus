// @ts-ignore
import swTemplate from '../sw/zeus-plugin.iife?raw'
interface ZeusOption {
  html: string;
  scope: string;
  prefix: string;
  swName: string;
}

const defaultZeusOption = {
  html: "index.html",
  prefix: "",
  scope: "",
  swName: "sw.js",
};

function applyServiceWorkerRegistration(
  htmlString: string,
  scope: string,
  prefix: string,
  swName: string
) {
  const addScope = !!scope;
  const addPrefix = !!prefix;
  return `${htmlString}
  <script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register('/${addPrefix ? `${prefix}/` : ""}${swName}'${
    addScope ? `,{ scope: './${scope}' }` : ""
  })
        .then(function() {
          console.log('ServiceWorker registered.');
        })
        .catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
  </script>`;
}

export default (option: ZeusOption = defaultZeusOption) => {
  const virtualModuleId = "/sw.js";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  const _option = { ...defaultZeusOption, ...option };
  return {
    name: "rollup-plugin-zeus",
    enforce: "post",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return swTemplate;
      }
    },
    generateBundle(_: any, bundle: any, t: any) {
      const htmlSource = bundle[_option.html].source;
      bundle[_option.html].source = applyServiceWorkerRegistration(
        htmlSource,
        _option.scope,
        _option.prefix,
        _option.swName
      );
    },
  };
};
