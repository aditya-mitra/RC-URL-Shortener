import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import {
  ISetting,
  SettingType,
} from '@rocket.chat/apps-engine/definition/settings';

import {
  zeroConfigs,
  sections,
  customConfigs,
  configTypes,
} from '../enums/appSettings';

const settings: ISetting[] = [
  {
    id: configTypes.id,
    i18nLabel: 'Config Type',
    i18nDescription: 'Type of Config to Use',
    packageValue: configTypes.zero,
    required: true,
    public: false,
    type: SettingType.SELECT,
    values: [
      {
        key: configTypes.zero,
        i18nLabel: 'Zero Config',
      },
      {
        key: configTypes.custom,
        i18nLabel: 'Custom Config',
      },
      {
        key: configTypes.domain,
        i18nLabel: 'Domain Name Config',
      },
    ],
  },
  {
    section: sections.zero,
    id: zeroConfigs.id,
    i18nLabel: 'provider',
    i18nDescription:
      'Select a provider which will shorten urls without any configurations needed',
    packageValue: zeroConfigs.cleanuri,
    required: false,
    public: true,
    type: SettingType.SELECT,
    values: [
      {
        key: zeroConfigs.cleanuri,
        i18nLabel: 'CleanURI',
      },
      {
        key: zeroConfigs.shrtcode,
        i18nLabel: 'SHRTCODE',
      },
      {
        key: zeroConfigs.tinyuid,
        i18nLabel: 'TinyUID',
      },
    ],
  },
  {
    section: sections.custom,
    id: customConfigs.provider,
    i18nLabel: 'Provider URL',
    i18nDescription:
      'The full url of the provider where the request for shortening should be made',
    packageValue: '',
    required: false,
    public: false,
    type: SettingType.STRING,
  },
  {
    section: sections.custom,
    id: customConfigs.header,
    i18nLabel: 'POST Request Headers',
    i18nDescription: 'The values to be sent in the headers of POST request',
    packageValue: '',
    required: false,
    public: false,
    type: SettingType.CODE,
    multiline: true,
  },
  {
    section: sections.custom,
    id: customConfigs.body,
    i18nLabel: 'POST Request Body',
    i18nDescription:
      'The values to be sent *along* in the body of POST request',
    packageValue: '',
    required: false,
    public: false,
    type: SettingType.CODE,
    multiline: true,
  },
];

export default async function appSettings(
  config: IConfigurationExtend,
): Promise<void> {
  await Promise.all(
    settings.map((setting) => config.settings.provideSetting(setting)),
  );
}
