import {
  IHttp,
  IModify,
  IPersistence,
  IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
  ISlashCommand,
  SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

import sendNotifyMessage from './lib/sendNotifyMessage';
import notifyTyping from './lib/notifyTyping';
import zeroConfigShorten from './zeroConfig/main';
import { configTypes } from './enums/appSettings';
import { IShortenResult } from './types/shortenCommand';
import customConfig from './customConfig/main';

export default class UrlShortenCommand implements ISlashCommand {
  public command = 'urlshorten';

  public i18nDescription = 'shorten long urls';

  public i18nParamsExample = '<url> <quick|custom>';

  public providesPreview = false;

  public async executor(
    ctx: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persist: IPersistence // eslint-disable-line
  ): Promise<void> {
    const url = ctx.getArguments()[0];

    const cancelTyping = await notifyTyping(
      modify.getNotifier(),
      ctx.getRoom(),
    );

    const envRead = read.getEnvironmentReader();

    const {
      value: configType,
    } = await read.getEnvironmentReader().getSettings().getById(configTypes.id);

    let val: IShortenResult = {};
    switch (configType) {
      case configTypes.zero:
        val = await zeroConfigShorten({
          envRead,
          http,
          url,
        });

        break;
      case configTypes.custom:
        val = await customConfig({ http, envRead, url });
        break;
      case configTypes.domain:
        val = { error: 'Domain name config was chosen' };
        break;
      default:
        val = {
          error:
            'A Wrong Configuration is chosen\nPlease check the App Settings',
        };
    }

    const { shortened, error } = val;

    cancelTyping();

    if (shortened) {
      sendNotifyMessage({
        modify,
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: shortened,
        room: ctx.getRoom(),
      });
    } else {
      sendNotifyMessage({
        modify,
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: error || 'SLASH COMMAND ERROR',
        room: ctx.getRoom(),
      });
    }
  }
}
