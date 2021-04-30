import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import appSettings from './src/settings/appSettings';
import Command from './src/Command';

export default class UrlshortenerApp extends App {
  protected async extendConfiguration(
    config: IConfigurationExtend,
  ): Promise<void> {
    await config.slashCommands.provideSlashCommand(new Command());
    await appSettings(config);
  }
}
