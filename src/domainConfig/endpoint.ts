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

function respondWithBadRequest(): IApiResponse {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    content: "The URL could not be found.",
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
      return respondWithBadRequest();
    }

    const association = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      slug
    );

    const found = await persistRead.readByAssociation(association);

    if (found.length === 0) {
      return respondWithBadRequest();
    }

    const content = found;

    return {
      status: HttpStatusCode.OK,
      content,
    };
  }
}
