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

  private async statCommand(ctx: SlashCommandContext, modify: IModify) {
    const triggerId = ctx.getTriggerId();
    if (!triggerId) {
      console.log("no trigger id found"); // eslint-disable-line
      return;
    }

    const block = modify.getCreator().getBlockBuilder();

    block.addContextBlock({
      blockId: 'stat_info_help',
      elements: [
        block.newMarkdownTextObject(
          '*Enter the slug of your shortened URL*\n _OR_ *If you have short name, you can enter it as well*',
        ),
      ],
    });

    block.addInputBlock({
      blockId: 'stat_block',
      element: block.newPlainTextInputElement({
        actionId: 'stat_input',
        multiline: false,
      }),
      label: block.newPlainTextObject('The URL Slug OR the Short Name'),
    });

    await modify.getUiController().openModalView(
      {
        id: `--${Date.now()}`,
        blocks: block.getBlocks(),
        title: block.newPlainTextObject('URL Statistics'),
      },
      { triggerId },
      ctx.getSender(),
    );
  }

  private async shortenCommand(
    url: string,
    ctx: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persist: IPersistence // eslint-disable-line
  ) {
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
      this.statCommand(ctx, modify);
      return;
    }

    this.shortenCommand(choice, ctx, read, modify, http, persist);
  }
}
