const storage = new Set<string>();
const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
export function uid(size = 7): string {
    let uid: string;
    do {
        uid = generateUid(size);
    } while (storage.has(uid))
    storage.add(uid);
    return uid;
}

function generateUid(size: number){
    return Array(size).fill(0).map((elem, index) => {
        let num = 0
        do {
            num = Math.floor(Math.random() * charSet.length);
        } while (index === 0 && num >= 52)
        return charSet[num];
    }).join('');
}
