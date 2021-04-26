import { IModifyCreator } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

interface ISendMessage {
  creator: IModifyCreator;
  msg: string;
  room: IRoom;
}

export default async function sendMessage({
  creator,
  msg,
  room,
}: ISendMessage): Promise<void> {
  const builder = creator.startMessage().setText(msg).setRoom(room);
  await creator.finish(builder);
}
