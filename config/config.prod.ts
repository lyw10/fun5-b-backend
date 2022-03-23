import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'prod.url'
  config.mongoose = {
    url: 'mongodb://fun5-mongo:27017/fun5'
   }
  return config;
};
