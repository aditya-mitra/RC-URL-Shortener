import {
  IEnvironmentRead,
  IHttp,
} from '@rocket.chat/apps-engine/definition/accessors';

import { zeroConfigs } from '../enums/appSettings';
import { IShortenResult } from '../types/shortenCommand';
import { IZeroConfigAPIResult } from '../types/zeroConfig';
import cleanUri from './cleanUri';
import tinyUid from './tinyUid';
import shrtCode from './shrtCode';
import vurl from './vurl';

interface IZeroConfigShorten {
  envRead: IEnvironmentRead;
  url: string;
  http: IHttp;
}

export default async function zeroConfigShorten({
  envRead,
  http,
  url,
}: IZeroConfigShorten): Promise<IShortenResult> {
  const env = await envRead.getSettings().getById(zeroConfigs.id);

  const { value: provider } = env;

  let val: IZeroConfigAPIResult = { shortened: '', error: '', api: '' };
  switch (provider) {
    case zeroConfigs.cleanuri:
      val = await cleanUri(url, http);
      break;
    case zeroConfigs.shrtcode:
      val = await shrtCode(url, http);
      break;
    case zeroConfigs.tinyuid:
      val = await tinyUid(url, http);
      break;
    case zeroConfigs.vurl:
      val = await vurl(url, http);
      break;
    default:
      val = {
        shortened: '',
        error:
          'The chosen _ZeroConfig_ Provider is incorrect\nPlease choose one from the available options',
        api: '*Incorrect Provider*',
      };
  }

  if (val.shortened && val.shortened.length > 0) {
    return {
      shortened: `Your shortened URL is ${val.shortened}`,
    };
  }

  const errorMessage = val.error
    ? `_${val.api}_ : \`${val.error}\``
    : `Problem getting response from provider: \`${provider}\``;
  return { error: errorMessage };
}
