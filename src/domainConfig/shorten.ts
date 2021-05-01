import {
  IPersistence,
  IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

import { IShortenResult } from "../types/shortenCommand";
import generateRandomId from "./helper";

interface IShortenWithCustomDomain {
  url: string;
  persist: IPersistence;
  persistRead: IPersistenceRead;
}

export default async function shortenWithCustomDomain({
  url,
  persist,
  persistRead,
}: IShortenWithCustomDomain): Promise<IShortenResult> {
  const id = await generateRandomId(persistRead);

  const association = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    id
  );

  await persist.createWithAssociation({ url }, association); // no need to await

  return { shortened: `The id is ${id}` };
}
