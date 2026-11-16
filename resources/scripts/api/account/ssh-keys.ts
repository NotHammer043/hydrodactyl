import { type SSHKey, Transformers } from '@definitions/user';
import type { AxiosError } from 'axios';
import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

import http, { type FractalResponseData, type FractalResponseList } from '@/api/http';

import { useUserSWRKey } from '@/plugins/useSWRKey';

const useSSHKeys = (config?: SWRConfiguration<SSHKey[], AxiosError>) => {
    const key = useUserSWRKey(['account', 'ssh-keys']);

    return useSWR(
        key,
        async () => {
            const { data } = await http.get<FractalResponseList>('/api/client/account/ssh-keys');

            return data.data.map((datum) => Transformers.toSSHKey(datum.attributes));
        },
        { revalidateOnMount: false, ...(config || {}) },
    );
};

const createSSHKey = async (name: string, publicKey: string): Promise<SSHKey> => {
    const { data } = await http.post<FractalResponseData>('/api/client/account/ssh-keys', {
        name,
        public_key: publicKey,
    });

    return Transformers.toSSHKey(data.attributes);
};

const deleteSSHKey = async (fingerprint: string): Promise<void> =>
    await http.post('/api/client/account/ssh-keys/remove', { fingerprint });

export { createSSHKey, deleteSSHKey, useSSHKeys };
