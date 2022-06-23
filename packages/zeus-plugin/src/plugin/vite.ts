// @ts-ignore
import { fstat } from "fs";
import swTemplate from "../../zeus-plugin.iife.js?raw";
import * as fs from "fs";
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

const defaultZeusOption = {
  html: "index.html",
  prefix: "",
  scope: "",
  swName: "sw",
  cacheVersion: 1,
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
        .register('/${addPrefix ? `${prefix}/` : ""}${swName}.js'${
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
  const _option = { ...defaultZeusOption, ...option };
  const virtualModuleId = `/${_option.swName}.js`;
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  return {
    name: "vite-plugin-zeus",
    transformIndexHtml(html: string) {
      const _html = applyServiceWorkerRegistration(
        html,
        _option.scope,
        _option.prefix,
        _option.swName
      );
      return _html;
    },
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const template = swTemplate.replace(
          /cacheVersion/g,
          String(_option.cacheVersion)
        );
        return template;
      }
    },
    writeBundle(options: any) {
      const template = swTemplate.replace(
        /cacheVersion/g,
        String(_option.cacheVersion)
      );
      fs.writeFileSync(`${options.dir}/${_option.swName}`, template, {
        encoding: "utf8",
      });
    },
  };
};
