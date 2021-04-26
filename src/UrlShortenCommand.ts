import {
  IHttp,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  ISlashCommand,
  SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";

import alertMessage from "./lib/alertMessage";

export default class UrlShortenCommand implements ISlashCommand {
  public command = "urlshorten";

  public i18nDescription = "shorten long urls";

  public i18nParamsExample = "<url> <quick|custom>";

  public providesPreview = false;

  public async executor(
    ctx: SlashCommandContext,
    _read: IRead,
    modify: IModify,
    http: IHttp,
    _peris: IPersistence
  ): Promise<void> {
    const url = ctx.getArguments()[0];
    try {
      const resp = await http.post("https://cleanuri.com/api/v1/shorten", {
        data: { url },
      });
      const shortened = resp.data?.result_url;

      alertMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: `shortened url is ${shortened}`,
        room: ctx.getRoom(),
      });
    } catch (e) {
      alertMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: `failed`,
        room: ctx.getRoom(),
      });
    }
  }
}
