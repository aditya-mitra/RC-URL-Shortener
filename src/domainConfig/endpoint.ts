import {
  HttpStatusCode,
  IHttp,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  ApiEndpoint,
  IApiEndpointInfo,
  IApiRequest,
  IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

function respondWithError(message?: string): IApiResponse {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    content: message || "The URL could not be found.",
    headers: {
      "Content-Type": "Text/Plain",
    },
  };
}

export default class RedirectEndpoint extends ApiEndpoint {
  public path = "redirect/:slug/"; // add a trailing slash to get the param
  public async get(
    req: IApiRequest,
    endpoint: IApiEndpointInfo,
    read: IRead,
    modify: IModify,
    http: IHttp,
    perist: IPersistence
  ): Promise<IApiResponse> {
    const persistRead = read.getPersistenceReader();

    const slug = req.params?.slug;
    if (!slug) {
      return respondWithError();
    }

    const association = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      slug
    );

    const found = await persistRead.readByAssociation(association);

    if (found.length === 0) {
      return respondWithError();
    }

    const longUrl = (found as any)[0].url;
    if (!longUrl) {
      return respondWithError(
        "Unknown error in URL Shortener App.\nPlease check logs."
      );
    }

    return {
      status: HttpStatusCode.FOUND,
      headers: { Location: longUrl },
    };
  }
}
