import { accessKey, masterKey } from './constants';

export class JsonBinController {
    private readonly jsonBinUrl: string;
    private readonly defaultHeaders: Record<string, string>;

    constructor(baseUrl: string) {
        this.jsonBinUrl = `${baseUrl}/b`;
        this.defaultHeaders = {
            'X-Master-Key': masterKey,
            'X-Access-Key': accessKey,
        };
    }

    async createBin(data: unknown, isPrivate: boolean = true, binName?: string) {
        const headers: Record<string, string> = {
            ...this.defaultHeaders,
            'Content-Type': 'application/json',
            'X-Bin-Private': String(isPrivate)
        };
        if (binName) {
            headers['X-Bin-Name'] = binName;
        }
        return fetch(this.jsonBinUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
    }

    async getBin(binId: string, withMeta: boolean = true) {
        const url = withMeta
            ? `${this.jsonBinUrl}/${binId}`
            : `${this.jsonBinUrl}/${binId}?meta=false`;
        return fetch(url, {
            method: 'GET',
            headers: this.defaultHeaders
        })
    }

    async updateBin(binId: string, data: unknown, versioning: boolean = false) {
        const url = `${this.jsonBinUrl}/${binId}`;
        const headers: Record<string, string> = {
            ...this.defaultHeaders,
            'Content-Type': 'application/json',
            'X-Bin-Versioning': String(versioning),
        };
        return fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        })
    }

    async deleteBin(binId: string) {
        const url = `${this.jsonBinUrl}/${binId}`;
        return fetch(url, {
            method: 'DELETE',
            headers: this.defaultHeaders
        })
    }

}