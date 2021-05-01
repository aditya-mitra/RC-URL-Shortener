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
    console.log("route hit", req);
    return {
      status: HttpStatusCode.OK,
    };
  }
}
