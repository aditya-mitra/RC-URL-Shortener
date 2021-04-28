## Rebrandly

Customized URL shortener with lot of options such as _workspace_, _domain name_, _custom short name_ and _url insights and statistics_ which can be configured very easily.

Has a **rate limit** of shortening 10 urls per second.

You can read and try out the API Documentations for Rebrandly [here](https://developers.rebrandly.com/reference#create-link-endpoint).

You can set up Rebrandly by following these steps:

1. Select the **Config Type** in the App Settings as `Custom Config` from the dropdown.

2. Get your API token from Rebrandly. You can refer [here](https://developers.rebrandly.com/docs/get-started#1-get-an-api-key) for help.

3. Paste API endpoint URL for creating new shortened links in **Provider URL**

```
https://api.rebrandly.com/v1/links
```

4. Rebrandly accepts `application/json` as it's _Content-Type_ and the `apikey` in the request headers. So you need to add the following in the **POST Request Headers**.

```json
{
  "Content-Type": "application/json",
  "apikey": "<API-KEY>"
}
```

\*Replace the `<API-KEY>` with the **api key** from your Rebrandly dashboard.

##### Workspaces and Domain Names

If you have [workspaces](https://app.rebrandly.com/workspaces) and [domains](https://app.rebrandly.com/domains) enabled, you might want to place your shortened urls under that workspace and domain. So, you just need to add `workspace` or `domain id` in the **POST Request Headers**.

```json
{
  "Content-Type": "application/json",
  "apikey": "<API-KEY>",
  "workspace": "<YOUR-WORKSPACE-ID>",
  "domain": {
    "id": "<YOUR-DOMAIN-ID>"
  }
}
```

5. The Long URLs will be valued with `destination` in the request body. So, you need to add it under **URL Key**.

```
destination
```

6. In the response body, the shortened URL will be valued with `shortURL`. So, you need to add it under **Long URL Key**.

```
shortUrl
```

That's it! You have set up Rebrandly to shorten your urls. 🎉

Type in the slash command in any channel to get a short url from Rebrandly
```
/shortenurl https://github.com/aditya-mitra/RC-URL-Shortener/actions
```