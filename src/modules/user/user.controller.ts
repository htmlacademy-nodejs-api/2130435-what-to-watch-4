import {inject, injectable} from 'inversify';
import {Controller} from '../../core/controller/controller.abstract.js';
import {AppComponent} from '../../types/app-components.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import {RestSchema} from '../../core/config/rest.schema.js';
import HttpError from '../../core/errors/http-error.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {UserServiceInterface} from './user-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import UserRdo from './rdo/user.rdo.js';
import {fillDto} from '../../core/helpers/index.js';
import LoginUserDto from './dto/login-user.dto.js';
import {ValidateDtoMiddleware} from '../../core/middleware/validate-dto.middleware.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    // this.addRoute({path: '/status', method: HttpMethod.Get, handler: this.index });
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login });
    // this.addRoute({path: '/login', method: HttpMethod.Delete, handler: this.create });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDto(UserRdo, result)
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
}
