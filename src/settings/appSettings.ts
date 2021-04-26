import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import {
  ISetting,
  SettingType,
} from '@rocket.chat/apps-engine/definition/settings';

const settings: ISetting[] = [
  {
    section: 'zero configs',
    id: 'zero_config_provider',
    i18nLabel: 'provider',
    i18nDescription:
      'select a provider which will shorten urls without any configurations needed',
    packageValue: 'cleanuri',
    required: false,
    public: true,
    type: SettingType.SELECT,
    values: [
      {
        key: 'cleanuri',
        i18nLabel: 'CleanURI',
      },
      {
        key: 'litelink',
        i18nLabel: 'LiteLink',
      },
      {
        key: 'tly',
        i18nLabel: 'T.LY',
      },
      {
        key: 'tinyuid',
        i18nLabel: 'TinyUID',
      },
      {
        key: 'zerowidthshortener',
        i18nLabel: 'Zero Width Shortener',
      },
    ],
  },
];

export default async function appSettings(config: IConfigurationExtend) {
  await Promise.all(
    settings.map((setting) => config.settings.provideSetting(setting)),
  );
}
