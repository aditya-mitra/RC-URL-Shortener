import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { IZeroConfigAPIResult } from '../types/zeroConfig';

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

// TODO: add documentation for cleanuri
// category=zeroconfig 
// for now add it in the `docs` folder
// of the **repository**