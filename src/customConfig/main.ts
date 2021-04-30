import {
  IEnvironmentRead,
  IHttp,
} from '@rocket.chat/apps-engine/definition/accessors';

import { IShortenResult } from '../types/shortenCommand';
import { CustomConfigSettings, getShortenedUrlFromResponse } from './helper';

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

    const shortenedUrl = getShortenedUrlFromResponse(resp?.data, responseUrlKey);
    const shortened = `Your shortened URL is ${shortenedUrl}`
    return { shortened };
  } catch (e) {
    if (!e.message) {
      // TODO: refactor this `console.log` to the app logger
      console.log(e); // eslint-disable-line
    }

    // TODO: Remove this error after doing for more custom urls
    console.log('ERROR ONLY VISIBLE FOR NOW\n\n', e); // eslint-disable-line

    const error = e?.message || 'Unexpected Error! \nPlease check logs';
    return { error };
  }
}
