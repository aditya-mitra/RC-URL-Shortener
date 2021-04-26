import { IModifyCreator } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";

export default async function sendMessage({
  creator,
  msg,
  room,
}: ISendMessage) {
  const builder = creator.startMessage().setText(msg).setRoom(room);
  await creator.finish(builder);
}

interface ISendMessage {
  creator: IModifyCreator;
  msg: string;
  room: IRoom;
}
