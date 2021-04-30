import { IConfigurationExtend } from "@rocket.chat/apps-engine/definition/accessors";
import {
  ISetting,
  SettingType,
} from "@rocket.chat/apps-engine/definition/settings";

import {
  zeroConfigs,
  sections,
  customConfigs,
  configTypes,
} from "../enums/appSettings";

const mainSettings: ISetting[] = [
  {
    id: configTypes.id,
    i18nLabel: "Config Type",
    i18nDescription: "Type of Config to Use",
    packageValue: configTypes.zero,
    required: true,
    public: false,
    type: SettingType.SELECT,
    values: [
      {
        key: configTypes.zero,
        i18nLabel: "Zero Config",
      },
      {
        key: configTypes.custom,
        i18nLabel: "Custom Config",
      },
      {
        key: configTypes.domain,
        i18nLabel: "Domain Name Config",
      },
    ],
  },
];

const zeroConfigSettings: ISetting[] = [
  {
    section: sections.zero,
    id: zeroConfigs.id,
    i18nLabel: "provider",
    i18nDescription:
      "Select a provider which will shorten urls without any configurations needed",
    packageValue: zeroConfigs.cleanuri,
    required: false,
    public: true,
    type: SettingType.SELECT,
    values: [
      {
        key: zeroConfigs.cleanuri,
        i18nLabel: "CleanURI",
      },
      {
        key: zeroConfigs.shrtcode,
        i18nLabel: "SHRTCODE",
      },
      {
        key: zeroConfigs.tinyuid,
        i18nLabel: "TinyUID",
      },
    ],
  },
];

const customConfigSettings: ISetting[] = [
  {
    section: sections.custom,
    id: customConfigs.provider,
    i18nLabel: "Provider URL",
    i18nDescription:
      "The full url of the provider where the request for shortening should be made",
    packageValue: "https://example.com/api/shorten",
    required: false,
    public: false,
    type: SettingType.STRING,
  },
  {
    section: sections.custom,
    id: customConfigs.header,
    i18nLabel: "POST Request Headers",
    i18nDescription: "The values to be sent in the headers of POST request",
    packageValue: "{}",
    required: false,
    public: false,
    type: SettingType.CODE,
    multiline: true,
  },
  {
    section: sections.custom,
    id: customConfigs.body,
    i18nLabel: "POST Request Body",
    i18nDescription:
      "The values to be sent *along* in the body of POST request",
    packageValue: "{}",
    required: false,
    public: false,
    type: SettingType.CODE,
    multiline: true,
  },
  {
    section: sections.custom,
    id: customConfigs.urlKey,
    i18nLabel: "Request URL Key",
    i18nDescription:
      "The URL key which will hold the value of long URL in *request data*",
    packageValue: "url",
    required: false,
    public: false,
    type: SettingType.STRING,
  },
  {
    section: sections.custom,
    id: customConfigs.responseUrlKey,
    i18nLabel: "Response URL Key",
    i18nDescription:
      "The URL key which will hold the value of shortened URL in *response data*",
    packageValue: "result_url",
    required: false,
    public: false,
    type: SettingType.STRING,
  },
  {
    section: sections.custom,
    id: customConfigs.statsEndpoint,
    i18nLabel: "Statistics Endpoint",
    i18nDescription: `The statistics endpoint for a shortened url.
Replace the value with \`$statId\` in your provided url.
_Leave blank if you want to disable_`,
    packageValue: "https://example.com/v1/stats/$statId",
    required: false,
    public: false,
    type: SettingType.STRING,
  },
];

export default async function appSettings(
  config: IConfigurationExtend
): Promise<void> {
  const settings = mainSettings.concat(
    zeroConfigSettings,
    customConfigSettings
  );
  await Promise.all(
    settings.map((setting) => config.settings.provideSetting(setting))
  );
}
