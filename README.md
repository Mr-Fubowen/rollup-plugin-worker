# Rollup-Plugin-Worker-Plus

### 介绍

这是一个 Vite，Rollup 插件，基于 Web Worker 实现，可让 Vite，Rollup 项目中的 JS 模块多线程运行。

该插件会在插件配置项 workerPath 目录下生成 .worker 目录，其中存在了 Web Worker 的调用方式，手动引入其中的 thread.js 使用其中的 run runAs 等方式调用即可。

此插件为纯开发插件，应放置于 devDependencies 下，.worker 目录会在项目启动或者构建的时候重新生成。

### 使用

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteConvertWorker } from 'web-worker-enhance/hooks/vite-convert-worker'

const workerPath = fileURLToPath(new URL('./src/utils', import.meta.url))
export default defineConfig({
    plugins: [
        vue(), 
        vueDevTools(), 
        viteConvertWorker(workerPath)],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
```