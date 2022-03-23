import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'prod.url'
  // config.mongoose = {
  //   url: 'mongodb://mongo:27018/fun5'
  // }
  return config;
};
