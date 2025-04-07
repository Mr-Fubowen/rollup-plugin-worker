import fs from 'fs-extra'
import { join, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import { format } from 'util'

const thread = fileURLToPath(new URL('./thread/thread.js', import.meta.url))
const threadWorker = fileURLToPath(new URL('./thread/thread.worker.js', import.meta.url))

async function createWorker(options) {
    const opts = {
        workerPath: ''
    }
    if (typeof options === 'string' || options instanceof String) {
        opts.workerPath = options
    } else {
        Object.assign(opts, options)
    }
    const rootPath = join(opts.workerPath, '.worker')
    await fs.ensureDir(rootPath)
    await fs.copyFile(thread, join(rootPath, 'thread.js'))
    await fs.copyFile(threadWorker, join(rootPath, 'thread.worker.js'))

    const files = await fs.readdir(opts.workerPath)
    const modules = []
    for (const it of files) {
        if (it.endsWith('.worker.js')) {
            continue
        }
        if (it.endsWith('.js')) {
            const name = basename(it, extname(it))
            const text = format('export * as %s from "../%s"', name, it)
            modules.push(text)
        }
    }
    const content = modules.join('\n')
    const modulePath = join(rootPath, 'thread.module.js')
    await fs.outputFile(modulePath, content, { encoding: 'utf-8' })
}
export default function viteConvertWorker(options) {
    return {
        enforce: 'pre',
        name: 'vite-convert-worker',
        async buildStart() {
            return await createWorker(options)
        }
    }
}
