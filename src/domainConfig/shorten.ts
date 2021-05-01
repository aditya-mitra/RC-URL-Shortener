import {
  IEnvironmentRead,
  IPersistence,
  IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { domainConfigs } from "../enums/appSettings";

import { IShortenResult } from "../types/shortenCommand";
import generateRandomId from "./helper";

interface IShortenWithCustomDomain {
  url: string;
  persist: IPersistence;
  persistRead: IPersistenceRead;
  envRead: IEnvironmentRead;
}

export default async function shortenWithCustomDomain({
  url,
  persist,
  persistRead,
  envRead,
}: IShortenWithCustomDomain): Promise<IShortenResult> {
  const domainUrl = (await envRead.getSettings().getById(domainConfigs.url))
    .value;
  if (!domainUrl) {
    return {
      error: `Domain Config - *The \`domain URL\` is not specified.\nPlease provide one in the app settings.`,
    };
  }

  const slug = await generateRandomId(persistRead);

  const association = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    slug
  );

  persist.createWithAssociation({ url }, association); // no need to await

  return { shortened: `Your shortened url is ${domainUrl + slug}` };
}
