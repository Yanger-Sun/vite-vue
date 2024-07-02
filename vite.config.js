import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createHtmlPlugin } from "vite-plugin-html";
import legacy from '@vitejs/plugin-legacy';

const packageInfo = require('./package.json');

const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};

// https://vitejs.dev/config/
export default(({ command, mode, isSsrBuild, isPreview }) => {
  let assetsDir = `assets/${packageInfo.name}`;
  let extendBuild = mode == 'production' ? {
    assetsDir
  } : {
    assetsDir
  };
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      legacy({ targets: ['defaults', 'not IE 11'] }),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_STATIC_CDN: getViteEnv(mode, "VITE_APP_STATIC_CDN"),
          },
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
     /*  https: true, //(使用https)启用 TLS + HTTP/2。注意：当 server.proxy 选项 也被使用时，将会仅使用 TLS
      host: true, // 监听所有地址
      port: 8080, //指定开发服务器端口：默认3000
      open: true, //启动时自动在浏览器中打开 */
      cors: true, //为开发服务器配置 CORS
      proxy: {
        //配置自定义代理规则
        // 字符串简写写法
        '/v2': {
          target: 'https://tenapi.cn',
          changeOrigin: true, //是否跨域
          /** 
              //'^/api': '/api'  //实际请求地址是http://baidu.com/api/news/list
              // '^/api/': '/'  //实际请求地址是http://baidu.com/news/list
              // 我的理解就是http://baidu.com替换了/api/news/list里面的/api
           * */ 
          // rewrite: path => path.replace(/^\/v2/, '')
        }
      }
      // hmr: {
      //   overlay: false
      // }
    },
    // ******项目构建配置******
    base: getViteEnv(mode, "VITE_APP_STATIC_CDN"),
    build: {
      rollupOptions: {
        output: {
          // entryFileNames: `${assetsDir}/js/[name].[hash][ext]`,
          // chunkFileNames: `${assetsDir}/js/[name].[hash][ext]`,
          assetFileNames: (assetInfo) => {
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) { // 匹配资源文件后缀
              return `media/[name].[hash][ext]`;  // 创建media文件夹存放匹配的资源文件,name为该文件的原名，hash为哈希值，ext为文件后缀名，以[name].[hash][ext]命名规则
            }
            return `${assetsDir}/[ext]/[name]-[hash].[ext]`; // 不匹配的资源文件存放至assets，以[name]-[hash].[ext]命名规则，注意两处的命名规则不同
          },
        },
      },
      target: 'modules', //设置最终构建的浏览器兼容目标  //es2015(编译成es5) | modules
      outDir: 'dist', // 构建得包名  默认：dist
      assetsDir: 'assets', // 静态资源得存放路径文件名  assets
      sourcemap: false, //构建后是否生成 source map 文件
      brotliSize: false, // 启用/禁用 brotli 压缩大小报告。 禁用该功能可能会提高大型项目的构建性能
      minify: 'esbuild', // 项目压缩 :boolean | 'terser' | 'esbuild'
      chunkSizeWarningLimit: 1000, //chunk 大小警告的限制（以 kbs 为单位）默认：500
      cssTarget: 'chrome61', //防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制符号的形式  (要兼容的场景是安卓微信中的 webview 时,它不支持 CSS 中的 #RGBA 十六进制颜色符号)
      ...extendBuild,
    }
  })
})
