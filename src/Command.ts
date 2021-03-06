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
import zeroConfigShorten from './zeroConfig/shorten';
import { configTypes } from './enums/appSettings';
import { IShortenResult } from './types/shortenCommand';
import customConfig from './customConfig/shorten';
import customConfigStats from './customConfig/stats';
import domainConfig from './domainConfig/shorten';

export default class Command implements ISlashCommand {
  public command = 'shortenurl';

  public i18nDescription = 'shorten long urls';

  public i18nParamsExample = '<url> <quick|custom>';

  public providesPreview = false;

  private async statCommand(
    slug: string,
    ctx: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
  ): Promise<void> {
    // TODO: show the result in modal
    // category=improvement
    // it is not possible to get the data inside the modal without it being submitted
    // however,
    // **still showing the result in a beautiful yaml-like format in the modal is possible**

    const envRead = read.getEnvironmentReader();
    const { shortened, error } = await customConfigStats({
      envRead,
      http,
      slug,
    });

    if (shortened) {
      sendNotifyMessage({
        msg: shortened,
        room: ctx.getRoom(),
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
      });
      return;
    }

    sendNotifyMessage({
      msg: error || 'STAT COMMAND ERROR',
      room: ctx.getRoom(),
      notify: modify.getNotifier(),
      sender: ctx.getSender(),
    });
  }

  private async shortenCommand(
    url: string,
    ctx: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persist: IPersistence,
  ) {
    const cancelTyping = await notifyTyping(
      modify.getNotifier(),
      ctx.getRoom(),
    );

    const envRead = read.getEnvironmentReader();
    const persistRead = read.getPersistenceReader();

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
        val = await domainConfig({
          url,
          persist,
          envRead,
          persistRead,
        });

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
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: shortened,
        room: ctx.getRoom(),
      });
    } else {
      sendNotifyMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: error || 'SLASH COMMAND ERROR',
        room: ctx.getRoom(),
      });
    }
  }

  public async executor(
    ctx: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persist: IPersistence,
  ): Promise<void> {
    const choice = ctx.getArguments()[0];

    if (choice.match(/stat(?:s|istics)?\b/)) {
      const slug = ctx.getArguments()[1];

      this.statCommand(slug, ctx, read, modify, http);
      return;
    }

    this.shortenCommand(choice, ctx, read, modify, http, persist);
  }
}
