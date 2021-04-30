export enum sections {
  zero = 'zero config',
  custom = 'custom config',
  domain = 'domain name config',
}

export enum configTypes {
  id = 'config_types',
  zero = 'zero_config_enabled',
  custom = 'custom_config_enabled',
  domain = 'domain_name_config_enabled',
}

export enum zeroConfigs {
  id = 'zero_config_provider',
  cleanuri = 'cleanuri',
  tinyuid = 'tinyuid',
  shrtcode = 'shrtcode',
}

export enum customConfigs {
  id = 'custom_config',
  provider = 'custom_config_provider',
  header = 'custom_config_header',
  body = 'custom_config_post_request_body',
  urlKey = 'long_url_key',
  responseUrlKey='short_url_key',
  statsEndpoint='stat_endpoint',
}
