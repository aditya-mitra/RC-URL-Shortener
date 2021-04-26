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

import alertMessage from './lib/alertMessage';
import notifyTyping from './lib/notifyTyping';
import zeroConfigShorten from './zeroConfig/shorten';

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

    const { shortened, error } = await zeroConfigShorten({
      envRead: read.getEnvironmentReader(),
      http,
      url,
    });

    cancelTyping();

    if (shortened) {
      alertMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: shortened,
        room: ctx.getRoom(),
      });
    } else {
      alertMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: error || 'SLASH COMMAND ERROR',
        room: ctx.getRoom(),
      });
    }
  }
}
