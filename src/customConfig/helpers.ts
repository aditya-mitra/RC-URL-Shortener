import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import { customConfigs } from '../enums/appSettings';

interface IGetAll {
  providerUrl: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  urlKey: string;
  responseUrlKey: string;
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
      return JSON.parse(headers);
    } catch (e) {
      throw new Error('The *Headers* for Custom Config are not valid JSON');
    }
  }

  private async getBody(): Promise<Record<string, unknown>> {
    const body = (await this.envRead.getSettings().getById(customConfigs.body)).value
      || {};
    try {
      return JSON.parse(body);
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

  async getAll(): Promise<IGetAll> {
    // do not catch the error. the try catch in ./main will do it
    const vals = await Promise.all([
      this.getProvider(),
      this.getHeaders(),
      this.getBody(),
      this.getUrlKey(),
      this.getResponseUrlKey(),
    ]);
    console.log(vals, '---');
    const [providerUrl, headers, body, urlKey, responseUrlKey] = vals;
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
