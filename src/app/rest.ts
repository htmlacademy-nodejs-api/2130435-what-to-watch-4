import {LoggerInterface} from '../core/logger/logger.interface.js';
import {ConfigInterface} from '../core/config/config.interface.js';
import {RestSchema} from '../core/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import {AppComponents} from '../types/app-components.enum.js';

@injectable()
export default class RestApplication {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>
  ) {}

  public async init(): Promise<void> {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
