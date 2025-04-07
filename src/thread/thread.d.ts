type EventCallbackMap = {
    [event: string]: (...args: unknown[]) => unknown | void
}

export interface Progress {
    duration: number
    timestamp: number
    length: number
    current: number
    total: number
    percentage: number
}

export interface ExecuteOptions {
    /**
     * 超时时间(毫秒)，-1 表示禁用超时
     * @default -1
     */
    timeout?: number
    /**
     * 独立线程，是否在新线程中运行此方法
     * @default false
     */
    isNewThread?: boolean
    /**
     * 事件监听器配置
     * @example
     * {
     *   progress: (p: Progress) => console.log(p.percentage)
     * }
     */
    on?: EventCallbackMap
}
/**
 * 在默认 Worker 线程中，调用脚本中的函数
 * @param module  模块名称(去掉后缀的脚本文件名称，名称仅有数字字母和下划线构成)
 * @param method  方法名称，模块中包含的方法名称
 * @param args    参数数组，支持函数作为参数
 * @param options 配置对象
 */
export declare function run<T = unknown>(
    module: string,
    method: string,
    args?: unknown[],
    options?: ExecuteOptions
): Promise<T>
/**
 * 在默认 Worker 线程中，调用脚本中的函数
 * @param module  模块名称(去掉后缀的脚本文件名称，名称仅有数字字母和下划线构成)
 * @param method  方法名称，模块中包含的方法名称
 * @param args    参数列表，支持函数作为参数
 */
export declare function runAs<T = unknown>(
    module: string,
    method: string,
    ...args: unknown[]
): Promise<T>
/**
 * 在新的 Worker 线程中，调用脚本中的函数
 * @param module  模块名称(去掉后缀的脚本文件名称，名称仅有数字字母和下划线构成)
 * @param method  方法名称，模块中包含的方法名称
 * @param args    参数列表，支持函数作为参数
 */
export declare function runAsNew<T = unknown>(
    module: string,
    method: string,
    ...args: unknown[]
): Promise<T>
