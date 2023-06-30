import fs from 'fs/promises';

export async function fileExists(path: string) {
    try {
        await fs.stat(path);
        return true;
    } catch (e) {
        return false;
    }
}

export async function readJSONFile<T>(path: string, encoding: BufferEncoding = 'utf8') {
    const fileContent = await fs.readFile(path, encoding);
    return JSON.parse(fileContent) as T;
}

export async function writeJSONFile(path: string, data: any) {
    await fs.writeFile(path, JSON.stringify(data, null, 4));
}