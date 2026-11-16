import http, { type FractalResponseList } from '@/api/http';

export interface ApiKey {
    identifier: string;
    description: string;
    allowedIps: string[];
    createdAt: Date | null;
    lastUsedAt: Date | null;
}

export const rawDataToApiKey = (data: Record<string, unknown>): ApiKey => ({
    identifier: data.identifier as string,
    description: data.description as string,
    allowedIps: data.allowed_ips as string[],
    createdAt: data.created_at ? new Date(data.created_at as string) : null,
    lastUsedAt: data.last_used_at ? new Date(data.last_used_at as string) : null,
});

export default (): Promise<ApiKey[]> => {
    return new Promise((resolve, reject) => {
        http.get<FractalResponseList>('/api/client/account/api-keys')
            .then(({ data }) => resolve(data.data.map((datum) => rawDataToApiKey(datum.attributes))))
            .catch(reject);
    });
};
