import { IHttp } from "@rocket.chat/apps-engine/definition/accessors";

/**
 * using cleanuri api
 * @param url url to be shortened
 */
export default async function cleanUri(
  url: string,
  http: IHttp
): Promise<[string, string]> {
  const resp = await http.post("https://cleanuri.com/api/v1/shorten", {
    data: { url },
  });

  const shortened = resp.data?.result_url;
  const error = resp.data?.error;

  return [shortened, error];
}
