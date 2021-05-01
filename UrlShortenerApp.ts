import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import {
  ApiSecurity,
  ApiVisibility,
} from '@rocket.chat/apps-engine/definition/api';
import appSettings from './src/settings/appSettings';
import Command from './src/Command';
import RedirectEndpoint from './src/domainConfig/endpoint';

export default class UrlshortenerApp extends App {
  protected async extendConfiguration(
    config: IConfigurationExtend,
  ): Promise<void> {
    await config.api.provideApi({
      visibility: ApiVisibility.PUBLIC,
      security: ApiSecurity.UNSECURE,
      endpoints: [new RedirectEndpoint(this)],
    });
    await config.slashCommands.provideSlashCommand(new Command());
    await appSettings(config);
  }
}
