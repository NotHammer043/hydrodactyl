import { transform } from '@definitions/helpers';
import type * as Models from '@definitions/user/models';

import type { FractalResponseData } from '@/api/http';

type UserAttributes = {
    uuid: string;
    username: string;
    email: string;
    image: string;
    '2fa_enabled': boolean;
    permissions: Models.User['permissions'];
    created_at: string;
};

type ActivityLogAttributes = {
    id: string;
    batch: Models.ActivityLog['batch'];
    event: string;
    ip: string | null;
    is_api: boolean;
    description: string | null;
    properties: Models.ActivityLog['properties'];
    has_additional_metadata?: boolean;
    timestamp: string;
    relationships?: FractalResponseData['attributes']['relationships'];
};

const toSSHKey = (data: Record<string, unknown>): Models.SSHKey => {
    return {
        name: data.name as string,
        publicKey: data.public_key as string,
        fingerprint: data.fingerprint as string,
        createdAt: new Date(data.created_at as string),
    };
};

const toUser = ({ attributes }: FractalResponseData): Models.User => {
    const user = attributes as UserAttributes;

    return {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        image: user.image,
        twoFactorEnabled: user['2fa_enabled'],
        permissions: user.permissions || [],
        createdAt: new Date(user.created_at),
        can(permission): boolean {
            return this.permissions.includes(permission);
        },
    };
};

const toActivityLog = ({ attributes }: FractalResponseData): Models.ActivityLog => {
    const log = attributes as ActivityLogAttributes;
    const { actor } = log.relationships || {};

    return {
        id: log.id,
        batch: log.batch,
        event: log.event,
        ip: log.ip,
        isApi: log.is_api,
        description: log.description,
        properties: log.properties,
        hasAdditionalMetadata: log.has_additional_metadata ?? false,
        timestamp: new Date(log.timestamp),
        relationships: {
            actor: transform(actor as FractalResponseData, toUser, null),
        },
    };
};

const Transformers = { toSSHKey, toUser, toActivityLog };
export default Transformers;

export const MetaTransformers = {};
