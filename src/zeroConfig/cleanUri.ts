import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { IZeroConfigAPIResult } from '../types/zeroConfig';

// TODO: Add documenatation for cleanuri
// category=documentation estimate=30m
// [homepage](https://cleanuri.com/)

/**
 * using cleanuri api
 * @param url url to be shortened
 */
export default async function cleanUri(
  url: string,
  http: IHttp,
): Promise<IZeroConfigAPIResult> {
  const resp = await http.post('https://cleanuri.com/api/v1/shorten', {
    data: { url },
  });

  const shortened = resp.data?.result_url;
  const error = resp.data?.error;

  return { shortened, error, api: 'cleanuri' };
}
