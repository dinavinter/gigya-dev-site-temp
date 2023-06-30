export function debounce(fn: Function, ms: number) {
    let timeoutId: NodeJS.Timeout;
    return function (thisArg: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(thisArg, args), ms);
    }
}