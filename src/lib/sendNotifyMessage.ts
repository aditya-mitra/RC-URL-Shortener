import {
  IModify,
  INotifier,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  IMessage,
  MessageActionType,
} from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
  BlockElementType,
  BlockType,
  ButtonStyle,
  TextObjectType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

interface IAlertMessage {
  modify: IModify;
  notify: INotifier;
  sender: IUser;
  room: IRoom;
  msg: string;
}

export default async function sendNotifyMessage({
  notify,
  sender,
  msg,
  room,
  modify,
}: IAlertMessage): Promise<void> {
  const block = modify.getCreator().getBlockBuilder();
  block.newMarkdownTextObject(msg);
  block.newButtonElement({
    text: { type: TextObjectType.PLAINTEXT, text: "Send to Channel" },
  });
  const message: IMessage = {
    room,
    text: msg,
    sender, // TODO: change the sender to app and not user
    avatarUrl:
      "https://res.cloudinary.com/gamersinstinct7/image/upload/v1619461323/rc/url_shortener_icon.png", // TODO: change this to netlify later
    blocks: block.getBlocks(),
  };
  await notify.notifyUser(sender, message);
}
