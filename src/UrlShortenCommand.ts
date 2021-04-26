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
import { zeroConfigs } from "./enums/appSettings";

import alertMessage from "./lib/alertMessage";
import notifyTyping from "./lib/notifyTyping";
import cleanUri from "./zeroConfig/cleanUri";

export default class UrlShortenCommand implements ISlashCommand {
  public command = "urlshorten";

  public i18nDescription = "shorten long urls";

  public i18nParamsExample = "<url> <quick|custom>";

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
      ctx.getRoom()
    );

    const [shortened, error] = await cleanUri(url, http);

    const provider = read
      .getEnvironmentReader()
      .getSettings()
      .getById(zeroConfigs.id);
    console.log("the chosen provider is", provider);

    cancelTyping();

    if (shortened) {
      alertMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg: `shortened url is ${shortened}`,
        room: ctx.getRoom(),
      });
    } else {
      const msg = error
        ? `_cleanuri_ \`${error}\``
        : "_cleanuri_ Could not shorten url";

      alertMessage({
        notify: modify.getNotifier(),
        sender: ctx.getSender(),
        msg,
        room: ctx.getRoom(),
      });
    }
  }
}
