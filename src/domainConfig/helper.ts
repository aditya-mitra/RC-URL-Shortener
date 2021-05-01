import { IPersistenceRead } from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

/**
 * generate a random 5 digit string
 */
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 7);
}

// TODO: add a different function `customName` inputs

/**
 * generate a string until it does not exist in the storage
 */
export default async function generateFreshId(
  persistRead: IPersistenceRead
): Promise<string> {
  const randomId = generateRandomId();
  const association = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    randomId
  );
  const record = await persistRead.readByAssociation(association);
  if (record.length > 0) {
    // try again for a new one
    return await generateFreshId(persistRead);
  }
  return randomId;
}
