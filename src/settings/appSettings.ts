import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import {
  ISetting,
  SettingType,
} from '@rocket.chat/apps-engine/definition/settings';

import { zeroConfigs } from '../enums/appSettings';

const settings: ISetting[] = [
  {
    section: 'zero configs',
    id: zeroConfigs.id,
    i18nLabel: 'provider',
    i18nDescription:
      'select a provider which will shorten urls without any configurations needed',
    packageValue: 'cleanuri',
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
];

export default async function appSettings(
  config: IConfigurationExtend,
): Promise<void> {
  await Promise.all(
    settings.map((setting) => config.settings.provideSetting(setting)),
  );
}
