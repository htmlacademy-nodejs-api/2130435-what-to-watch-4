import {inject, injectable} from 'inversify';
import {Controller} from '../../core/controller/controller.abstract.js';
import {AppComponent} from '../../types/app-components.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {FilmServiceInterface} from './film-service.interface.js';
import FilmRdo from './rdo/film.rdo.js';
import {fillDto} from '../../core/helpers/index.js';
import CreateFilmDto from './dto/create-film.dto.js';
import {StatusCodes} from 'http-status-codes';
import {Genre} from '../../types/film.type.js';
import {RequestQuery} from '../../types/request-query.type.js';
import * as core from 'express-serve-static-core';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CreateCommentDto from '../comment/dto/create-comment.dto.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
import {ValidateObjectIdMiddleware} from '../../core/middleware/validate-objectid.middleware.js';
import {ValidateDtoMiddleware} from '../../core/middleware/validate-dto.middleware.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import {DocumentExistsMiddleware} from '../../core/middleware/document-exists.middleware.js';
import {ValidateGenreMiddleware} from '../../core/middleware/validate-genre.middleware.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.FilmServiceInterface) protected readonly filmsService: FilmServiceInterface,
    @inject(AppComponent.CommentServiceInterface) protected readonly commentsService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateFilmDto)
      ]
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'filmId')
      ]
    });

    this.addRoute({
      path: '/genre/:genre',
      method: HttpMethod.Get,
      handler: this.indexGenre,
      middlewares: [
        new ValidateGenreMiddleware('genre')
      ]
    });

    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.showPromo });

    this.addRoute({path: '/watch-list', method: HttpMethod.Get, handler: this.indexWatchList });
    // this.addRoute({path: '/watch-list/:filmId', method: HttpMethod.Post, handler: this.create });
    // this.addRoute({path: '/watch-list/:filmId', method: HttpMethod.Delete, handler: this.create });

    //comment
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.indexComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'filmId'),
      ]
    });
  }

  public async index(
    req: Request<
      core.ParamsDictionary, undefined, undefined,
      RequestQuery
    >, res: Response) {
    const {query} = req;
    const films = await this
      .filmsService.find(query.limit, query.offset);
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async show(req: Request, res: Response) {
    const films = await this
      .filmsService.findByFilmId(req.params.filmId);
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async indexGenre(req: Request, res: Response) {
    const films = await this
      .filmsService.findByGenre(req.params.genre as Genre);
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async showPromo(_req: Request, res: Response) {
    const films = await this
      .filmsService.findPromoFilm();
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async indexWatchList(_req: Request, res: Response) {
    const films = await this
      .filmsService.findWatchListFilms();
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async create(
    { body }: Request<
      Record<string, unknown>, Record<string, unknown>, CreateFilmDto
    >,
    res: Response
  ) {
    const result = await this
      .filmsService.create(body);
    const film = await this.filmsService.findByFilmId(result.id);
    this.created(res,fillDto(FilmRdo, film));
  }

  public async update(
    { body, params }: Request<
      Record<string, unknown>, Record<string, unknown>, CreateFilmDto
    >,
    res: Response
  ) {
    const result = await this
      .filmsService.updateFilmById(params.filmId as string, body);
    this.created(res,fillDto(FilmRdo, result));
  }

  public async delete(
    { params }: Request<
      Record<string, unknown>, Record<string, unknown>, CreateFilmDto
    >,
    res: Response
  ) {
    const findFilm = await this
      .filmsService.findByFilmId(params.filmId as string);

    if (!findFilm) {
      const errorMessage = `Film with id ${params.filmId} not find`;
      this.send(res, StatusCodes.NOT_FOUND, errorMessage);
      return this.logger.error(errorMessage);
    }

    const result = await this
      .filmsService.deleteFilmById(params.filmId as string);
    this.noContent(res,fillDto(FilmRdo, result));
  }

  //comment
  public async indexComments(
    {params}: Request,
    res: Response
  ) {
    const comments = await this
      .commentsService.findByFilmId(params.filmId);
    const commentsToResponse = fillDto(CommentRdo, comments);
    this.ok(res, commentsToResponse);
  }

  public async createComment(
    {body, params}: Request<{filmId: string}, object, CreateCommentDto>,
    res: Response
  ) {

    const comment = await this
      .commentsService.create({...body, filmId: params.filmId});
    await this.filmsService.incCommentsCount(body.filmId);
    this.created(res, fillDto(CommentRdo, comment));
  }
}
