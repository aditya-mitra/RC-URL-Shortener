import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import { customConfigs } from '../enums/appSettings';

interface IGetAllShortenSettings {
  providerUrl: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  urlKey: string;
  responseUrlKey: string;
}

interface IGetAllStatsSettings {
  headers: Record<string, string>;
  statsEndpoint: string;
}

function parseObject(obj: string): Record<string, string> {
  if (obj.match(/{\s*}/)) {
    return {};
  }
  return JSON.parse(obj);
}

export class CustomConfigSettings {
  private envRead: IEnvironmentRead;

  constructor(envRead: IEnvironmentRead) {
    this.envRead = envRead;
  }

  private async getProvider(): Promise<string> {
    const provider: string = (await this.envRead.getSettings().getById(customConfigs.provider))
      .value || '';
    if (provider.length === 0) {
      throw new Error('The Custom Config URL has not been set');
    }
    return provider;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers = (await this.envRead.getSettings().getById(customConfigs.header)).value
      || {};
    try {
      return parseObject(headers);
    } catch (e) {
      throw new Error('The *Headers* for Custom Config are not valid JSON');
    }
  }

  private async getBody(): Promise<Record<string, unknown>> {
    const body = (await this.envRead.getSettings().getById(customConfigs.body)).value
      || {};
    try {
      return parseObject(body);
    } catch (e) {
      throw new Error('The *Body* for Custom Config is not valid JSON');
    }
  }

  private async getUrlKey(): Promise<string> {
    const urlKey: string = (
      await this.envRead.getSettings().getById(customConfigs.urlKey)
    ).value;
    if (!urlKey || urlKey.length === 0) {
      throw new Error('The *URL Key* for _request_ body has not been set');
    }
    return urlKey;
  }

  private async getResponseUrlKey(): Promise<string> {
    const responseUrlKey: string = (
      await this.envRead.getSettings().getById(customConfigs.responseUrlKey)
    ).value;
    if (!responseUrlKey || responseUrlKey.length === 0) {
      throw new Error(
        'The *Response URL Key* for _response_ body has not been set',
      );
    }
    return responseUrlKey;
  }

  private async getStatsEndpoint(): Promise<string> {
    const statsEndpoint: string = (
      await this.envRead.getSettings().getById(customConfigs.statsEndpoint)
    ).value;
    if (!statsEndpoint || statsEndpoint.length === 0) {
      throw new Error('*Statistics* have not been configured.');
    }
    return statsEndpoint;
  }

  async getAllStatsSettings(): Promise<IGetAllStatsSettings> {
    const [statsEndpoint, headers] = await Promise.all([
      this.getStatsEndpoint(),
      this.getHeaders(),
    ]);
    return { statsEndpoint, headers };
  }

  async getAllShortenSettings(): Promise<IGetAllShortenSettings> {
    // do not catch the error. the try catch in ./main will do it
    const [
      providerUrl,
      headers,
      body,
      urlKey,
      responseUrlKey,
    ] = await Promise.all([
      this.getProvider(),
      this.getHeaders(),
      this.getBody(),
      this.getUrlKey(),
      this.getResponseUrlKey(),
    ]);

    return {
      providerUrl,
      headers,
      body,
      urlKey,
      responseUrlKey,
    };
  }
}

export function getShortenedUrlFromResponse(
  responseData: Record<string, unknown>,
  responseUrlKey: string,
): string {
  const nestedKeys = responseUrlKey.split('.');
  try {
    return nestedKeys.reduce((resp, key) => resp[key], responseData) as string;
  } catch (_e) {
    throw new Error(
      'The provided *responseUrlKey* was not found in the _response body_ .\nOr you might have incorrectly nested the *responseUrlKey*.',
    );
  }
}

export function replaceSlugInEndpoint(endpoint: string, slug: string): string {
  const endpointWithSlug = endpoint.replace(/$statId/i, slug);
  if (endpoint === endpointWithSlug) {
    // replace did not do anything
    throw new Error(
      '`statId` was not specified.\nPlease put `statId` in the stats endpoint.',
    );
  }
  return endpointWithSlug;
}
