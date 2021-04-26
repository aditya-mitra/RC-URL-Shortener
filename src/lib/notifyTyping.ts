import { INotifier } from '@rocket.chat/apps-engine/definition/accessors';
import { TypingScope } from '@rocket.chat/apps-engine/definition/accessors/INotifier';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

/**
 * notifies the users in the room that urlshortener is typing
 */
export default async function notifyTyping(
  notify: INotifier,
  room: IRoom,
): Promise<() => Promise<void>> {
  const cancel = await notify.typing({
    id: room.id,
    scope: TypingScope.Room,
    username: 'url shortener',
  });

  return cancel;
}
