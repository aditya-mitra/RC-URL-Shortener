import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import appSettings from './src/settings/appSettings';
import UrlShortenCommand from './src/UrlShortenCommand';

export default class UrlshortenerApp extends App {
  protected async extendConfiguration(
    config: IConfigurationExtend,
  ): Promise<void> {
    await config.slashCommands.provideSlashCommand(new UrlShortenCommand());
    await appSettings(config);
  }
}
