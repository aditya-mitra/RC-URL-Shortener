import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { IZeroConfigAPIResult } from '../types/zeroConfig';

export default async function shrtCode(
  url: string,
  http: IHttp,
): Promise<IZeroConfigAPIResult> {
  const resp = await http.post('https://api.shrtco.de/v2/shorten', {
    params: {
      url,
    },
  });

  if (resp.data.ok) {
    const shortened = resp.data?.result.full_short_link2;
    return { shortened, api: 'ShrtCode' };
  }

  const error = resp.data?.error_code === 2 ? 'Invalid URL submitted' : resp.data.error;

  return { error, api: 'ShrtCode' };
}
