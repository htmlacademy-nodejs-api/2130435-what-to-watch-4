import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './app/rest.js';
import {AppComponents} from './types/app-components.enum.js';
import {LoggerInterface} from './core/logger/logger.interface.js';
import {ConfigInterface} from './core/config/config.interface.js';
import {RestSchema} from './core/config/rest.schema.js';
import PinoService from './core/logger/pino.service.js';
import ConfigService from './core/config/config.service.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(AppComponents.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<LoggerInterface>(AppComponents.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponents.ConfigInterface).to(ConfigService).inSingletonScope();

  const application = container.get<RestApplication>(AppComponents.RestApplication);
  await application.init();
}

bootstrap();
