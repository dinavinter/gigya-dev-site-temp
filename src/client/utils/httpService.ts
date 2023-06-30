class HttpService {
    public async get(url:string, params: object = {}) {
        const finalUrl = Object.keys(params)
            .reduce((url, key, currentIndex) => {
                if (currentIndex === 0) {
                    return `${url}?${key}=${params[key]}`
                }
                return `${url}&${key}=${params[key]}`
            }, url)
        const result = await fetch(finalUrl, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });
        if (result.redirected) {
            window.location.href = result.url;
        }
        return await result.json();
    }

    public async post(url: string, body?: any) {
        const result = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (result.redirected) {
            window.location.href = result.url;
        }
        return await result.json();
    }

    public async put(url: string, body?: any) {
        const result = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(body)
        });

        return await result.json();
    }

    public async delete(url: string) {
        const result = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
        });

        return await result.json();
    }
}

export const http = new HttpService();