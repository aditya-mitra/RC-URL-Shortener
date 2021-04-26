import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { IZeroConfigAPIResult } from '../types/zeroConfig';

// TODO: LiteLink is not functional
//  the request is not being accepted

export default async function liteLink(
  url: string,
  http: IHttp,
): Promise<IZeroConfigAPIResult> {
  const resp = await http.post('https://litelink.ml/GetShortURL', {
    data: { URLToShorten: url },
  });

  if (resp.statusCode === 200) {
    return { shortened: resp.content, api: 'litelink' };
  }

  return { error: resp.content, api: 'litelink' };
}
