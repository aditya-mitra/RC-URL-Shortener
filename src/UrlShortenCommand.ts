import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import {
  ISlashCommand,
  SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export default class UrlShortenCommand implements ISlashCommand {
  public command = 'urlshorten';

  public i18nDescription = 'shorten long urls';

  public i18nParamsExample = '<url> <quick|custom>';

  public providesPreview = false;

  public async executor(
    ctx: SlashCommandContext,
    _read: IRead,
    modify: IModify,
  ): Promise<void> {
    const message = 'shorten urls from app';

    const messageStructure = modify.getCreator().startMessage();
    const sender = ctx.getSender(); // the user calling the slashcommand
    const room = ctx.getRoom(); // the current room

    messageStructure.setSender(sender).setRoom(room).setText(message);

    await modify.getCreator().finish(messageStructure);
  }
}
