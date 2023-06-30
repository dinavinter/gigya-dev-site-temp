import dns from 'dns/promises';

const cache: {
    [key: string]: {
        ip: string;
        expiresIn: number;
    }
} = {};

export async function resolveIp(host: string, ttl = 3): Promise<string> {
    if (cache[host] && !(cache[host].expiresIn > Date.now())) {
        return cache[host].ip;
    }
    const resolvedIps = await dns.lookup(host);
    if (resolvedIps.address) {
        cache[host] = {
            ip: resolvedIps.address,
            expiresIn: Date.now() + (1000 * 60 * 60 * ttl)
        }
        return resolvedIps.address;
    }
    return null;
}