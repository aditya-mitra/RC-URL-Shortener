import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { IZeroConfigAPIResult } from '../types/zeroConfig';

/**not using because the urls have to encoded */
export default async function vurl(
  url: string,
  http: IHttp,
): Promise<IZeroConfigAPIResult> {
  const resp = await http.post('https://vurl.com/api.php', {
    params: {
      url,
    },
  });

  if (resp.content !== 'Invalid URL') {
    return { shortened: resp.content, api: 'VURL' };
  }

  return { error: resp.content, api: 'VURL' };
}
