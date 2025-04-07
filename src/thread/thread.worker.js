import * as modules from './thread.module.js'

function decode(args) {
    return args?.map(it => {
        if (it.type === 'ARGS_FUNCTION') {
            return (...args) => {
                self.postMessage({
                    id: it.id,
                    type: it.type,
                    args
                })
            }
        }
        return it.value
    })
}

self.onmessage = async function (event) {
    const { id, module, method, args } = event.data
    try {
        const _module = modules[module]
        if (!_module) {
            throw new Error(module + ' module does not exist')
        }
        const _method = _module[method]
        if (!_method) {
            throw new Error(method + ' method does not exist')
        }
        const context = {
            emit: (name, ...args) =>
                self.postMessage({
                    id: id,
                    type: 'EVENT',
                    name: name,
                    args
                })
        }
        self.postMessage({
            id,
            type: 'SUCCESS',
            data: await _method.call(context, ...decode(args))
        })
    } catch (error) {
        self.postMessage({
            id,
            type: 'ERROR',
            data: error
        })
    } finally {
        self.postMessage({
            id,
            type: 'FINALLY'
        })
    }
}
