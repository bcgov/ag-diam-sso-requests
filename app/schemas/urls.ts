import { getRedirectUrlPropertyNameByEnv } from 'utils/helpers';
import { urlPattern as pattern } from './providers';

export default function getSchema(env: string | undefined, defaultUrls: string[]) {
  const name = getRedirectUrlPropertyNameByEnv(env);
  return {
    type: 'object',
    properties: {
      [name]: {
        type: 'array',
        title: null,
        items: { type: 'string', pattern },
        additionalItems: { type: 'string', pattern },
        default: defaultUrls,
      },
    },
  };
}