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
import {createJWT, fillDto} from '../../core/helpers/index.js';
import LoginUserDto from './dto/login-user.dto.js';
import {ValidateDtoMiddleware} from '../../core/middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../core/middleware/validate-objectid.middleware.js';
import {UploadFileMiddleware} from '../../core/middleware/upload-file.middleware.js';
import {DocumentExistsMiddleware} from '../../core/middleware/document-exists.middleware.js';
import {JWT_ALGORITHM} from './user.constant.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import {PrivateRouteMiddleware} from '../../core/middleware/private-route.middleware.js';

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
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]
    });
    this.addRoute({
      path: '/status',
      method: HttpMethod.Get,
      handler: this.showStatus,
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId')
      ]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
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

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Only anonymous users can create an account.',
        'UserController'
      );
    }


    const result = await this
      .userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDto(UserRdo, result)
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id,
      }
    );

    this.ok(res, fillDto(LoggedUserRdo, {
      token,
      email: user.email
    }));
  }

  public async showStatus(req: Request, res: Response) {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const user = await this
      .userService.findByEmail(req.user.email);
    this.ok(res, fillDto(LoggedUserRdo, user));
  }

  public async logout(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {}
    );

    this.ok(res, fillDto(LoggedUserRdo, {
      token,
      email: ''
    }));
  }
}
