export function promisify(gigyaEndpoint: Function, params: any) {
    return new Promise<any>(resolve => {
        gigyaEndpoint.call(null, {
            ...params,
            callback: resolve
        });
    })
}