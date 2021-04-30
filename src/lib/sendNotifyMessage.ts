import { INotifier } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

interface IAlertMessage {
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
}: IAlertMessage): Promise<void> {
  const message: IMessage = {
    text: msg,
    room,
    sender, // TODO: change the sender to app and not user
    avatarUrl:
      'https://res.cloudinary.com/gamersinstinct7/image/upload/v1619461323/rc/url_shortener_icon.png', // TODO: change this to netlify later
  };
  await notify.notifyUser(sender, message);
}
