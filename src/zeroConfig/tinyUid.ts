import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { IZeroConfigAPIResult } from '../types/zeroConfig';

export default async function tinyUid(
  url: string,
  http: IHttp,
): Promise<IZeroConfigAPIResult> {
  const resp = await http.post('https://tinyuid.com/api/v1/shorten', {
    data: { url },
  });

  const shortened = resp.data?.result_url;
  const error = resp.data?.error;

  return { shortened, error, api: 'TinyUID' };
}
