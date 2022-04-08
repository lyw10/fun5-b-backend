import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { join } from 'path'
import * as dovenv from 'dotenv'
dovenv.config()
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1631677352881_6029';

  // add your egg config in here
  config.middleware = [ 'customError' ];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  config.view = {
    defaultViewEngine: 'nunjucks'
  }
  config.logger = {
    consoleLevel: 'DEBUG'
  }
  config.mongoose = {
    url: `mongodb://${process.env.HOST}:27018/fun5`,
    options: {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS
    }
  }
  config.bcrypt = {
    saltRounds: 10
  }
  config.session = {
    encrypt: false
  }
  config.jwt = {
    enable: true,
    secret: process.env.JWT_SECRET || '',
    match: [ '/api/users/getUserInfo', '/api/works', '/api/utils/upload-img', '/api/channel' ]
  }
  config.redis = {
    client: {
      port: 15002,
      host: process.env.HOST,
      password: '123456',
      db: 0
    }
  }
  config.multipart = {
    whitelist: [ '.png', '.jpg', '.jpeg', '.gif', '.webp' ],
    fileSize: '1mb'
  }
  config.static = {
    dir: [
      { prefix: '/public', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/uploads', dir: join(appInfo.baseDir, 'uploads') }
    ]
  }
  const aliCloudConfig = {
    accessKeyId: process.env.ALC_ACCESS_KEY,
    accessKeySecret: process.env.ALC_SECRET_KEY,
    endpoint: 'dysmsapi.aliyuncs.com'
  }
  config.oss = {
    client: {
      accessKeyId: process.env.ALC_ACCESS_KEY || '',
      accessKeySecret: process.env.ALC_SECRET_KEY || '',
      bucket: 'fun5-backend',
      endpoint: 'oss-cn-guangzhou.aliyuncs.com'
    }
  }
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: [ 'POST' ]
    },
    baseUrl: 'default.url',
    aliCloudConfig,
    H5BaseURL: 'http://localhost:7001/api/pages'
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
