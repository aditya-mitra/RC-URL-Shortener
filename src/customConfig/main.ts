import {
  IEnvironmentRead,
  IHttp,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IShortenResult } from '../types/shortenCommand';
import { CustomConfigSettings, getShortenedUrlFromResponse } from './helpers';

interface ICustomConfigShorten {
  http: IHttp;
  envRead: IEnvironmentRead;
  url: string;
}

export default async function customConfigShorten({
  http,
  envRead,
  url,
}: ICustomConfigShorten): Promise<IShortenResult> {
  const customConfigSettings = new CustomConfigSettings(envRead);

  try {
    const {
      providerUrl,
      headers,
      body,
      urlKey,
      responseUrlKey,
    } = await customConfigSettings.getAll();

    body[urlKey] = url;

    const resp = await http.post(providerUrl, {
      headers,
      data: body,
    });

    const shortened = getShortenedUrlFromResponse(resp.data, responseUrlKey);
    return { shortened };
  } catch (e) {
    if (!e.message) {
      // TODO: refactor this `console.log` to the app logger
      console.log(e);
    }
    const error = e?.message || 'Unexpected Error! \nPlease check logs';
    return { error };
  }
}
