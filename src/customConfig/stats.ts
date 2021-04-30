import {
  IEnvironmentRead,
  IHttp,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IShortenResult } from '../types/shortenCommand';
import { CustomConfigSettings, replaceSlugInEndpoint } from './helper';

interface ICustomConfigStats {
  slug: string;
  http: IHttp;
  envRead: IEnvironmentRead;
}

export default async function customConfigStats({
  slug,
  http,
  envRead,
}: ICustomConfigStats): Promise<IShortenResult> {
  const customConfigSettings = new CustomConfigSettings(envRead);

  try {
    const {
      headers,
      statsEndpoint,
    } = await customConfigSettings.getAllStatsSettings();
    const endpointWithSlug = replaceSlugInEndpoint(statsEndpoint, slug);

    const resp = await http.post(endpointWithSlug, {
      headers,
    });

    return { shortened: resp.data };
  } catch (e) {
    if (!e.message) {
      // TODO: refactor this `console.log` to the app logger
      console.log("STATS | ", e); // eslint-disable-line
    }

    // TODO: Remove this error after doing for more custom urls
    console.log("STATS | ERROR ONLY VISIBLE FOR NOW\n\n", e); // eslint-disable-line

    const error = e?.message || 'Unexpected Error! \nPlease check logs';
    return { error };
  }
}
