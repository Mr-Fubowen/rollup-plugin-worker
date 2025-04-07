let id = 0
let running = new Map()
const defaultWorker = create()

function create() {
    const worker = new Worker(new URL('./thread.worker.js', import.meta.url), {
        type: 'module'
    })
    worker.onmessage = function (evt) {
        const { id, name, args, data, type } = evt.data
        switch (type) {
            case 'ARGS_FUNCTION':
                {
                    const fn = running.get(id)
                    fn?.(...args)
                }
                break
            case 'SUCCESS':
                {
                    const { resolve } = running.get(id)
                    resolve(data)
                }
                break
            case 'ERROR':
                {
                    const { reject } = running.get(id)
                    reject(data)
                }
                break
            case 'EVENT': {
                {
                    const { options } = running.get(id)
                    options.on?.[name]?.(...args)
                }
                break
            }
            case 'FINALLY':
                {
                    const { timer, args, options } = running.get(id)
                    running.delete(id)
                    clearTimeout(timer)
                    args?.forEach(it => {
                        running.delete(it.id)
                    })
                    options.isNewThread && worker.terminate()
                }
                break
        }
    }
    return worker
}
function encode(args) {
    return args?.map(it => {
        const item = {}
        if (typeof it === 'function') {
            const _id = id++
            running.set(_id, it)
            item.id = _id
            item.type = 'ARGS_FUNCTION'
        } else {
            item.value = it
        }
        return item
    })
}
export function run(module, method, args, options) {
    const { timeout, isNewThread } = options || {}
    const worker = isNewThread ? create() : defaultWorker
    return new Promise((resolve, reject) => {
        let timer
        const _id = id++
        if (timeout > 0) {
            timer = setTimeout(() => {
                running.delete(_id)
                isNewThread && worker.terminate()
                reject(new Error(module + '.' + method + ' method has been cancelled'))
            }, timeout)
        }
        const params = encode(args)
        worker.postMessage({
            id: _id,
            module,
            method,
            args: params
        })
        running.set(_id, {
            args: params,
            timer,
            options: options || {},
            resolve,
            reject
        })
    })
}
export function runAs(module, method, ...args) {
    return run(module, method, args, {
        isNewThread: false
    })
}
export function runAsNew(module, method, ...args) {
    return run(module, method, args, {
        isNewThread: true
    })
}
